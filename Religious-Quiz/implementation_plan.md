# Biblical Values Quiz - Implementation Plan (Google Slides + Apps Script)

This plan outlines the strategy to build and refine the "Biblical Values Quiz" presentation.

## Team Roles & Responsibilities

1.  **Orchestrator (AntiGravity)**:
    -   Guide the process.
    -   Verify the output.
2.  **Builder (Agent/User + Gemini in Slides)**:
    -   **Step 1**: Use Gemini 3 to generate the base presentation.
    -   **Step 2**: Manually refine the layout (images, text boxes) for the first few slides to set the "Master Design".
3.  **Implementer (Codex)**:
    -   **Step 3**: Write a **Google Apps Script** to programmatically fix alignment issues across the entire deck.
    -   *Note*: Codex may utilize `chrome-devtools-mcp` if available/configured for browser inspection, but the primary output is the Apps Script.

## Goal
Create a 43-slide presentation where "Reveal" slides perfectly align with "Question" slides, eliminating "eyeballing" errors.

## Workflow Strategy

### Phase 1: Build & Refine (Current Status: In Progress)
-   **User**: Continue using Gemini to generate the slides (Q1-Q20).
-   **User**: Manually adjust the layout of the first Question/Reveal pair to look *exactly* how you want (Image size, Answer box positions). **This is your "Template".**

### Phase 2: The Alignment Fix (Apps Script)
Instead of manually fixing every slide, we will use code.

1.  **Codex**: Write a Google Apps Script (`align_slides.gs`) that does the following:
    -   Iterates through the slides.
    -   Identifies "Question" slides and their matching "Reveal" slides.
    -   **Copy Position**: Finds the correct answer box on the "Reveal" slide and forces its `Left`, `Top`, `Width`, and `Height` properties to match the corresponding box on the "Question" slide *exactly*.
    -   **Hide Others**: Ensures wrong answers are removed/hidden on the Reveal slide (if desired).

2.  **Agent (User)**:
    -   **Action**: Open the presentation in Google Slides.
    -   **Action**: Go to `Extensions > Apps Script`.
    -   **Action**: Paste the code provided by Codex.
    -   **Action**: Run the `alignSlides()` function.
    -   *Note*: The Agent must do this manually because the AI cannot bypass Google's "Review Permissions" OAuth dialog.

### Phase 3: Verification
1.  **Check Alignment**: Toggle between Q and Reveal slides. The answer box should not "jump" pixel-by-pixel.
2.  **Check Content**: Ensure text is correct.

## Technical Notes for Codex
-   **Target Application**: Google Slides (Google Apps Script).
-   **Logic**:
    -   Slides are pairs: `[Question, Reveal, Question, Reveal...]`.
    -   On Question Slide: Find the shape with text matching the Correct Answer. Get its geometry.
    -   On Reveal Slide: Find the corresponding shape. Set its geometry to match.
-   **MCP Tool**: `chrome-devtools-mcp` (https://github.com/ChromeDevTools/chrome-devtools-mcp) is available for inspecting the DOM if needed to understand internal IDs, though Apps Script uses the SlidesApp API.

## Next Steps
1.  **User**: Finish generating the raw slides with Gemini.
2.  **Codex**: Write the `align_slides.gs` script.
