# Biblical Values Quiz Automation

This project contains the tools and data used to automate the creation of a Google Slides presentation for a "Biblical Values Quiz".

## Contents

### Source Code
- **`align_slides.gs`**: Google Apps Script to programmatically build the slides. It includes the full quiz data embedded as JSON and logic to:
    - Clear existing slides (Q3-Q20).
    - Clone Master Slide layouts.
    - Populate text for Questions and Answers.
    - Highlight the correct answer on "Reveal" slides.
- **`fix_mhtml.py`**: Python script designed to parse and patch an MHTML export of the presentation (alternative approach).

### Data
- **`BIBLICAL_VALUES_QUIZ_COMPLETE_20_QUESTIONS_FOR_GEMINI.md`**: The original source data containing all questions, options, and correct answers.
- **`quiz_content_for_gemini.txt`**: A clean, simplified text version of the quiz data, formatted for easy consumption by LLMs (like Gemini).

### Documentation
- **`PROTOTYPE_SUMMARY.md`**: Summary of the initial prototype analysis.
- **`implementation_plan.md`**: Technical plan for the automation project.

## Usage

1.  **Google Apps Script**: Copy the content of `align_slides.gs` into the Script Editor of your Google Slides presentation. Run the `rebuildQuiz` function.
2.  **MHTML Fix**: (Optional) Use `fix_mhtml.py` if working with MHTML exports.
