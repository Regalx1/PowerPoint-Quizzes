/**
 * BIBLICAL VALUES QUIZ - THE REBUILDER
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Slides presentation.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this entire code into the editor.
 * 4. Click "Save".
 * 5. Refresh your Google Slides tab.
 * 6. Run "🚀 Rebuild Quiz from Data".
 */

// CONFIGURATION
const MASTER_Q_INDEX = 3; // Slide 3 is the Master Question Template
const MASTER_R_INDEX = 4; // Slide 4 is the Master Reveal Template
const GREEN_HEX = '#27ae60'; // The green color for correct answers

// FULL QUIZ DATA (Parsed from Markdown)
const QUIZ_DATA = [
  {
    "qNum": 1,
    "text": "Why did God tell Adam and Eve they could not eat of the one tree in the Garden of Eden?",
    "options": {
      "A": "Because God said \"It's forbidden\" and even though I dont understand, I have faith that God wants whats best for us",
      "B": "Because God wanted the tree for himself",
      "C": "Because that tree was a gift someone else was supposed to care for",
      "D": "None of the Above"
    },
    "correct": "D"
  },
  {
    "qNum": 2,
    "text": "How did the Snake trick Adam and Eve into disobeying God?",
    "options": {
      "A": "The Snake threatened to hurt them if they didn't eat of the tree",
      "B": "The Snake pretended to be their friend and promised to help them fulfill their desires if they disobeyed God",
      "C": "The Snake flopped on the floor and made a scene until they did what the Snake asked",
      "D": "All of the Above"
    },
    "correct": "B"
  },
  {
    "qNum": 3,
    "text": "Why did Adam and Eve have to leave the Garden of Eden after disobeying God?",
    "options": {
      "A": "Because the animals were angry that the tree was gone",
      "B": "Because they wanted to hide from God so that they could eat more fruit from the tree",
      "C": "Because they weren't hungry anymore and they wanted to go out and play",
      "D": "Because the tree cursed them with original sin, and sinful creatures were not allowed to stay in the Garden of Eden"
    },
    "correct": "D"
  },
  {
    "qNum": 4,
    "text": "Your friend tells you to take a toy that belongs to another kid without asking. What should you do?",
    "options": {
      "A": "Take the toy because your friend told you to",
      "B": "Say no and tell your friend taking toys is not kind",
      "C": "Hide the toy so no one knows",
      "D": "Take the toy but give it back later"
    },
    "correct": "B"
  },
  {
    "qNum": 5,
    "text": "God created Adam and Eve because:",
    "options": {
      "A": "He can punish them every time they did something God didn't like",
      "B": "They can do whatever they want",
      "C": "God wanted them to look after all his other creations (The Earth and the living creatures)",
      "D": "Because he just felt like it"
    },
    "correct": "C"
  },
  {
    "qNum": 6,
    "text": "Why did God choose Noah and his family to build the Ark?",
    "options": {
      "A": "Because Noah was god's favorite",
      "B": "Because God hates his children and he wanted to punish Noah with extra work so he can destroy humanity",
      "C": "Because God knew he could only trust Noah and his family to protect the world from being overrun with Sin after he unfortunately had to wipe it clean",
      "D": "Because God can't do anything by himself"
    },
    "correct": "C"
  },
  {
    "qNum": 7,
    "text": "What did Noah do when God told him to build the ark?",
    "options": {
      "A": "Noah said no, it was too hard",
      "B": "Noah laughed because it seemed silly",
      "C": "Noah trusted God and built the ark, even though it took a very long time",
      "D": "Noah asked someone else to build it"
    },
    "correct": "C"
  },
  {
    "qNum": 8,
    "text": "What did Noah bring onto the ark?",
    "options": {
      "A": "His family and two of every animal",
      "B": "Only his family",
      "C": "Only the animals he liked best",
      "D": "Nobody and nothinghe went alone"
    },
    "correct": "A"
  },
  {
    "qNum": 9,
    "text": "The kids made fun of you for believing that God would protect you. What would Noah do?",
    "options": {
      "A": "He would give up because he doesn't like to be made fun of",
      "B": "He would attack the person that challenged his beliefs",
      "C": "He would lie and pretend to only be friends with God when nobody was looking",
      "D": "He would show patience kindness to those who mocked him because they did not understand God's plan"
    },
    "correct": "D"
  },
  {
    "qNum": 10,
    "text": "Someone you know is faithful to God, but they are struggling. What would Noah do?",
    "options": {
      "A": "Noah would ignore them and focus on his own problems",
      "B": "Noah would protect all those who are faithful to God, even at his own expense",
      "C": "Noah would help them but only if they are rewarded in return",
      "D": "Noah would ask God to help them instead, because it's God's responsibility to take care of others, not him"
    },
    "correct": "B"
  },
  {
    "qNum": 11,
    "text": "Who was the Pharaoh and what did he do?",
    "options": {
      "A": "The Pharaoh was the king of Egypt and treated the Israelites (God's people) badly",
      "B": "The Pharaoh was Moses's best friend",
      "C": "The Pharaoh helped the Israelites",
      "D": "The Pharaoh lived in the desert"
    },
    "correct": "A"
  },
  {
    "qNum": 12,
    "text": "What did God tell Moses to do?",
    "options": {
      "A": "God told Moses to run away and hide",
      "B": "God told Moses to go tell the Pharaoh to let God's people go free",
      "C": "God told Moses to be quiet and do nothing",
      "D": "God told Moses to get angry and fight"
    },
    "correct": "B"
  },
  {
    "qNum": 13,
    "text": "Why didn't Pharaoh Ramses believe that Moses's God was true even after being punished?",
    "options": {
      "A": "Because Pharaoh was too used to doing whatever he wanted and didn't want to stop, even when he was being punished",
      "B": "Because Pharaoh was born evil and couldn't stop even if he wanted to",
      "C": "Because Moses wasn't clear about why bad things kept happening to him",
      "D": "Because Pharaoh really hated the Jews, and would rather be punished than to free them"
    },
    "correct": "A"
  },
  {
    "qNum": 14,
    "text": "What should you do if you meet someone in real life that will never listen to God, no matter what you say?",
    "options": {
      "A": "Threaten them with God's wrath if they don't comply",
      "B": "Be patient with them because most people need to learn about God the hard way",
      "C": "Agree with them because they will like you more",
      "D": "Punish them because they deserve to suffer"
    },
    "correct": "B"
  },
  {
    "qNum": 15,
    "text": "You see someone being bossy and mean to others. How can you show Moses's kind of courage?",
    "options": {
      "A": "Join in and be mean too",
      "B": "Say nothing and let it happen",
      "C": "Kindly stand up for the people being treated badly",
      "D": "Tell them they're a bad person"
    },
    "correct": "C"
  },
  {
    "qNum": 16,
    "text": "What did Jesus do for 40 days in the wilderness?",
    "options": {
      "A": "Jesus played games",
      "B": "Jesus prayed and fasted (did not eat) to get strong spiritually",
      "C": "Jesus went swimming",
      "D": "Jesus visited his friends"
    },
    "correct": "B"
  },
  {
    "qNum": 17,
    "text": "What did the devil (Satan) try to get Jesus to do?",
    "options": {
      "A": "Turn rocks into bread because Jesus was hungry",
      "B": "Use His power to show off",
      "C": "Stop trusting His Father God",
      "D": "All of the above"
    },
    "correct": "D"
  },
  {
    "qNum": 18,
    "text": "Why did the snake wait 40 days before tempting Jesus on the rock?",
    "options": {
      "A": "The snake had to crawl up the rock slowly so it took a long time",
      "B": "The snake was evil and waited to tempt Jesus at his weakest point",
      "C": "The snake needed to do more research on Jesus before he could convincingly lie to him",
      "D": "The snake is the only one corrupting God's children to sin, so Jesus had to wait his turn"
    },
    "correct": "B"
  },
  {
    "qNum": 19,
    "text": "You're very tired and hungry, and you hear a voice telling you to do something that will get you in trouble with God. What do you do?",
    "options": {
      "A": "Listen to the voice because it's got good ideas",
      "B": "Listen to the voice because it won't stop tempting you until you give in",
      "C": "Don't listen because that voice is trying to manipulate you into being bad when you are tired and vulnerable to attack",
      "D": "Don't listen to it, unless that voice telling you to disobey God is from someone with over 1 million subscribers"
    },
    "correct": "C"
  },
  {
    "qNum": 20,
    "text": "You really want something that's not good for you. What's a good way to handle temptation?",
    "options": {
      "A": "Do it anyway because you want it",
      "B": "Ask God (or a grown-up) for help, remember what's right, and choose the good thing",
      "C": "Feel bad but do it anyway",
      "D": "Hide it so nobody knows"
    },
    "correct": "B"
  }
];

function onOpen() {
  SlidesApp.getUi().createMenu('Biblical Quiz')
    .addItem('🚀 Rebuild Quiz from Data', 'rebuildQuiz')
    .addToUi();
}

function rebuildQuiz() {
  const presentation = SlidesApp.getActivePresentation();
  const slides = presentation.getSlides();
  
  // Get Master Slides
  const masterQ = slides[MASTER_Q_INDEX - 1]; // Slide 3
  const masterR = slides[MASTER_R_INDEX - 1]; // Slide 4
  
  // Identify Master Shapes (Sort by Top/Left)
  const masterQShapes = getSortedShapes(masterQ);
  const masterRShapes = getSortedShapes(masterR);
  
  // We assume the Master Slide has:
  // 1. Title (Top)
  // 2. Question Body (Below Title)
  // 3. 4 Answer Boxes (Bottom)
  
  // Iterate through Data (Skip Q1, Q2)
  for (const data of QUIZ_DATA) {
    if (data.qNum < 3) continue; // Skip Q1, Q2
    
    // Calculate Slide Indices
    // Q1=0,1; Q2=2,3; Q3=4,5...
    const qIndex = (data.qNum - 1) * 2;
    const rIndex = qIndex + 1;
    
    if (qIndex >= slides.length || rIndex >= slides.length) {
      console.log(`Slides for Q${data.qNum} not found.`);
      continue;
    }
    
    // --- REBUILD QUESTION SLIDE ---
    rebuildSlide(slides[qIndex], masterQShapes, data, false);
    
    // --- REBUILD REVEAL SLIDE ---
    rebuildSlide(slides[rIndex], masterRShapes, data, true);
  }
  
  SlidesApp.getUi().alert("Quiz Rebuilt Successfully!");
}

function rebuildSlide(slide, masterShapes, data, isReveal) {
  // 1. Clear existing SHAPES (Keep Images)
  const existingShapes = slide.getShapes();
  existingShapes.forEach(s => s.remove());
  
  // 2. Copy Master Shapes & Populate Text
  // We assume masterShapes are sorted: Title, Question, A, B, C, D
  // But we need to be careful. Let's try to map them by position.
  
  // Let's assume the last 4 are answers.
  // The first one is Title.
  // The second one is Question.
  
  const answersStart = masterShapes.length - 4;
  
  masterShapes.forEach((ms, i) => {
    // Clone Shape
    const newShape = slide.insertShape(ms.getShapeType(), ms.getLeft(), ms.getTop(), ms.getWidth(), ms.getHeight());
    
    // Copy Style (Safely)
    try {
      const msFill = ms.getFill();
      if (msFill.getFillType() === SlidesApp.FillType.SOLID && msFill.getSolidFill()) {
        newShape.getFill().setSolidFill(msFill.getSolidFill().getColor());
      } else {
        // If not solid (e.g. transparent), make new shape transparent
        newShape.getFill().setTransparent();
      }
    } catch (e) {
      // Fallback
      newShape.getFill().setTransparent();
    }

    if (ms.getBorder()) {
      // Copy border if needed, or just set transparent if that's the style
      // newShape.getBorder().setTransparent(); 
    }
    
    // Copy Text Style (Font, Size, Color)
    try {
      const msText = ms.getText();
      const nsText = newShape.getText();
      nsText.getTextStyle()
        .setFontFamily(msText.getTextStyle().getFontFamily())
        .setFontSize(msText.getTextStyle().getFontSize())
        .setForegroundColor(msText.getTextStyle().getForegroundColor());
    } catch (e) {
      // Ignore if no text style to copy
    }
      
    // POPULATE TEXT
    let textToSet = "";
    
    if (i >= answersStart) {
      // It's an Answer Box
      const answerIndex = i - answersStart; // 0=A, 1=B, 2=C, 3=D
      if (answerIndex >= 0 && answerIndex < 4) {
        const letter = ['A', 'B', 'C', 'D'][answerIndex];
        textToSet = data.options[letter];
        
        // If Reveal Slide AND Correct Answer -> Highlight Green
        if (isReveal && data.correct === letter) {
          newShape.getFill().setSolidFill(GREEN_HEX);
        }
        
        if (isReveal && data.correct !== letter) {
           newShape.remove(); // Delete incorrect answers on Reveal
           return; 
        }
      }
      
    } else if (i === 0) {
      // Title
      textToSet = `Q${data.qNum}`; 
    } else if (i === 1) {
      // Question Body
      textToSet = data.text;
    }
    
    if (textToSet) {
      try {
        newShape.getText().setText(textToSet);
      } catch (e) {}
    }
  });
}

function getSortedShapes(slide) {
  const shapes = slide.getShapes();
  // Sort by Top, then Left
  // Filter out "Next" buttons AND non-text shapes
  const filtered = shapes.filter(s => {
    try {
      const t = s.getText().asString().toLowerCase();
      return !t.includes("next question") && !t.includes("click to reveal");
    } catch (e) { 
      // If getText() fails, it's not a text box. Skip it.
      return false; 
    }
  });
  
  filtered.sort((a, b) => {
    const topDiff = a.getTop() - b.getTop();
    if (Math.abs(topDiff) > 20) return topDiff;
    return a.getLeft() - b.getLeft();
  });
  return filtered;
}
