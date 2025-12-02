import json
import re
import os

# CONFIG
MHTML_PATH = r'g:\My Drive\PowerPoint-Quizzes\Religious-Quiz\Biblical Values Quiz - Google Slides.mhtml'
OUTPUT_PATH = r'g:\My Drive\PowerPoint-Quizzes\Religious-Quiz\Biblical Values Quiz - FIXED.mhtml'
DATA_PATH = 'quiz_data.json'

def load_data():
    with open(DATA_PATH, 'r') as f:
        return json.load(f)

def parse_style(style_str):
    style = {}
    for item in style_str.split(';'):
        if ':' in item:
            k, v = item.split(':', 1)
            style[k.strip()] = v.strip()
    return style

def get_px_value(val):
    if 'px' in val:
        return float(val.replace('px', ''))
    return 0

def update_html(html_content, quiz_data):
    # Split into slides
    # Regex to capture the full slide div
    # We use lookahead (?=...) to match the start of the next slide without consuming it.
    # We also need to capture the closing </div> of the current slide.
    # Pattern:
    # Group 1: <div ... title="Slide X">
    # Group 2: Slide Num
    # Group 3: Content (everything up to the closing div)
    # Group 4: Closing </div>
    # Lookahead: <div role="group" class="slide" OR </body>
    
    slide_pattern = re.compile(r'(<div role="group" class="slide" title="Slide (\d+)">)(.*?)(</div>)(?=<div role="group" class="slide"|</body>)', re.DOTALL)
    
    new_html = html_content
    
    parts = []
    last_pos = 0
    
    for match in slide_pattern.finditer(html_content):
        prefix = match.group(1) # <div ... title="Slide X">
        slide_num = int(match.group(2))
        content = match.group(3)
        closing_div = match.group(4)
        
        print(f"Found Slide {slide_num}")
        
        # Add the text before this slide
        parts.append(html_content[last_pos:match.start()])
        
        # PROCESS SLIDE CONTENT
        fixed_content = process_slide(content, slide_num, quiz_data)
        
        if fixed_content != content:
            print(f"  -> Slide {slide_num} MODIFIED")
        else:
            print(f"  -> Slide {slide_num} Unchanged")
            
        parts.append(prefix + fixed_content + closing_div)
        last_pos = match.end()
        
    parts.append(html_content[last_pos:])
    return "".join(parts)

def process_slide(content, slide_num, quiz_data):
    q_num = (slide_num + 1) // 2
    is_reveal = (slide_num % 2 == 0)
    
    q_data = next((q for q in quiz_data if q['qNum'] == q_num), None)
    if not q_data:
        print(f"  No data for Q{q_num}")
        return content

    # Find all shapes
    shape_pattern = re.compile(r'(<div class="shape"(.*?)style="(.*?)".*?>)(.*?)(</div>)', re.DOTALL)
    
    shapes = []
    for m in shape_pattern.finditer(content):
        shapes.append({
            'full_match': m.group(0),
            'open_tag': m.group(1),
            'attrs': m.group(2),
            'style_str': m.group(3),
            'inner_html': m.group(4),
            'close_tag': m.group(5),
            'style': parse_style(m.group(3))
        })
    
    print(f"  Found {len(shapes)} shapes")
        
    # Sort shapes by Top, then Left
    def sort_key(s):
        top = get_px_value(s['style'].get('top', '0px'))
        left = get_px_value(s['style'].get('left', '0px'))
        return (top, left)
        
    text_shapes = [s for s in shapes if 'role="img"' not in s['open_tag'] and get_px_value(s['style'].get('width', '0px')) < 1000]
    text_shapes.sort(key=sort_key)
    
    print(f"  Found {len(text_shapes)} text shapes")
    
    if len(text_shapes) < 4:
        print("  Not enough text shapes")
        return content
        
    answers = text_shapes[-4:]
    question_shape = text_shapes[-5] if len(text_shapes) >= 5 else None
    
    # Update Text
    # We need to replace the inner HTML of these shapes
    
    # Helper to replace text in inner_html
    def replace_text(html, new_text):
        # Regex to find the text inside <p>...<span...>TEXT</span>...</p>
        # This is hard. MHTML HTML is messy.
        # Simple approach: Replace the whole inner HTML with a clean <p> structure?
        # That might break fonts.
        # Better: Find the last > and first < of tags?
        # Let's just replace the content of the <p> tag if possible.
        # Or simply: create a new inner HTML string preserving the style of the first p?
        
        # Let's try to find the text content and replace it.
        # <p style="...">OLD TEXT<span ...></span></p>
        # We want: <p style="...">NEW TEXT<span ...></span></p>
        
        p_match = re.search(r'(<p.*?>)(.*?)(<span.*?>.*?</span>)?(</p>)', html, re.DOTALL)
        if p_match:
            start = p_match.group(1)
            # old_text = p_match.group(2)
            span = p_match.group(3) or ''
            end = p_match.group(4)
            return f"{start}{new_text}{span}{end}"
        return html

    # Update Answers
    opts = ['A', 'B', 'C', 'D']
    correct_shape = None
    
    for i, shape in enumerate(answers):
        letter = opts[i]
        new_text = q_data['options'].get(letter, '')
        if new_text:
            shape['new_inner'] = replace_text(shape['inner_html'], new_text)
            
        if is_reveal and q_data['correct'] == letter:
            correct_shape = shape

    # Update Question
    if question_shape and q_data['text']:
        question_shape['new_inner'] = replace_text(question_shape['inner_html'], q_data['text'])

    # RECONSTRUCT CONTENT
    # We need to replace the shapes in the original content string.
    # Since we have the original match objects, we can do replacements.
    # But we also need to handle the Green Box for Reveal slides.
    
    green_box_html = ""
    
    if is_reveal and correct_shape:
        # Find the Green Box Image
        # It's an image that is NOT the background (width=1200) and NOT tiny icons (width<50)
        # And usually has a green-ish filename? No, "image.png".
        # Let's look for an image that is roughly the size of an answer box (width ~300-500)
        
        images = [s for s in shapes if 'role="img"' in s['open_tag']]
        candidates = []
        for img in images:
            w = get_px_value(img['style'].get('width', '0px'))
            h = get_px_value(img['style'].get('height', '0px'))
            if 200 < w < 800 and 50 < h < 300:
                candidates.append(img)
        
        # The Green Box is likely one of these. 
        # In the MHTML I saw, it was `width:327px; height:170px`.
        # Let's assume the *first* candidate is the green box (or the one that overlaps the old correct answer?)
        # For now, let's just pick the first one and move it.
        
        if candidates:
            green_box = candidates[0]
            # Update its style to match correct_shape
            cs_style = correct_shape['style']
            
            # Construct new style string
            new_style = green_box['style_str']
            new_style = re.sub(r'top:\s*[\d\.]+px', f"top:{cs_style['top']}", new_style)
            new_style = re.sub(r'left:\s*[\d\.]+px', f"left:{cs_style['left']}", new_style)
            new_style = re.sub(r'width:\s*[\d\.]+px', f"width:{cs_style['width']}", new_style)
            new_style = re.sub(r'height:\s*[\d\.]+px', f"height:{cs_style['height']}", new_style)
            
            green_box['new_open'] = green_box['open_tag'].replace(green_box['style_str'], new_style)

    # Apply changes
    # We iterate backwards to avoid index shifts? 
    # Or just rebuild the string from pieces?
    # We have `shapes` list which contains ALL shapes in order of appearance in `content`.
    # We can rebuild `content` by iterating `shapes` and using `new_inner` or `new_open` if present.
    
    # But `shapes` was regex found. There might be text *between* shapes (whitespace).
    # We need to be careful.
    
    # Let's use string replacement on the unique `full_match` strings?
    # Risky if duplicates exist.
    
    # Better: Splicing.
    # We know the start/end of each shape in `content` from `finditer`.
    # But I didn't store indices in the loop above. Let's re-find or store them.
    
    # Re-run finditer to get indices
    replacements = [] # (start, end, new_text)
    
    for m in shape_pattern.finditer(content):
        full_match = m.group(0)
        # Find which shape object this corresponds to
        # (Assuming order is preserved, which it is)
        # We need to link `m` to our `shapes` list.
        # Let's just re-do the logic inside the loop? No, that's inefficient.
        
        # Let's match by `full_match` string?
        # Find the shape in our processed list that has this `full_match`.
        # Be careful of duplicates.
        
        target_shape = None
        for s in shapes:
            if s['full_match'] == full_match and 'processed' not in s:
                target_shape = s
                s['processed'] = True
                break
        
        if target_shape:
            replacement = full_match
            if 'new_inner' in target_shape:
                replacement = replacement.replace(target_shape['inner_html'], target_shape['new_inner'])
            if 'new_open' in target_shape:
                replacement = replacement.replace(target_shape['open_tag'], target_shape['new_open'])
            
            if replacement != full_match:
                replacements.append((m.start(), m.end(), replacement))
                
    # Apply replacements backwards
    replacements.sort(key=lambda x: x[0], reverse=True)
    
    new_content = list(content)
    for start, end, text in replacements:
        new_content[start:end] = list(text)
        
    return "".join(new_content)


import email
import quopri

# ... (imports and helper functions remain the same)

def main():
    print("Loading data...")
    data = load_data()
    
    print("Reading MHTML with email library...")
    with open(MHTML_PATH, 'r') as f:
        msg = email.message_from_file(f)
        
    html_part = None
    for part in msg.walk():
        if part.get_content_type() == 'text/html':
            html_part = part
            break
            
    if not html_part:
        print("Could not find text/html part")
        return
        
    print("Decoding HTML...")
    # get_payload(decode=True) returns bytes
    html_bytes = html_part.get_payload(decode=True)
    html_content = html_bytes.decode('utf-8')
    
    print("Processing HTML...")
    fixed_html = update_html(html_content, data)
    
    if fixed_html == html_content:
        print("WARNING: No changes made to HTML content!")
    
    print("Updating MHTML...")
    # We need to set the payload. 
    # If we just set_payload(string), it might not encode it as QP.
    # But MHTML usually expects QP.
    # Let's try setting it and see if the email library handles it.
    # Actually, we should probably encode it ourselves if we want to be safe, 
    # or just set it and let the library decide (it might switch to base64 or 7bit).
    # But to preserve the MHTML structure, QP is best.
    
    # The email library in Python 3 handles encoding if we construct it right.
    # But modifying an existing Message object's payload is tricky.
    # html_part.set_payload(fixed_html.encode('utf-8')) 
    # And we might need to update headers?
    # Let's just set the payload and see.
    
    # Actually, to be safe, let's just write the raw bytes and let the user/browser handle it?
    # No, MHTML is strict.
    
    # Let's try to set the payload.
    html_part.set_payload(fixed_html, charset='utf-8')
    
    print(f"Saving to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w') as f:
        f.write(msg.as_string())
        
    print("Done!")

if __name__ == '__main__':
    main()
