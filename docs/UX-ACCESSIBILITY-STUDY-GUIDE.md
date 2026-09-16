# UX and accessibility study guide

This guide translates Nielsen Norman Group research into review criteria for Spelling Bee Prep. It is a design aid, not a substitute for testing with learners, caregivers, educators, keyboard users, or assistive technology.

## 1. Make the next action obvious

Visual hierarchy should guide attention in intended order through contrast, scale, proximity, and restrained grouping. Only one or two elements should dominate a view.

**Review questions**

- Can a learner identify the primary action in a few seconds?
- Do heading size, spacing, and containers communicate the sequence?
- Is color reserved for meaningful emphasis instead of decoration?

**Applied here:** setup is one grouped region; the start action dominates the ready state; active practice reads as Listen, Spell, then Feedback.

Source: [Visual Hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)

## 2. Maximize signal, minimize noise

Minimalist design means retaining everything necessary for the task while removing low-information decoration, jargon, and competing treatments. Clarity has priority over visual flourish.

**Review questions**

- Does every visible element support setup, spelling, feedback, or progress?
- Are labels and helper text concise and specific?
- Are typography and colors consistent enough to remain meaningful?

**Applied here:** one restrained indigo accent, neutral surfaces, concise helper copy, one prominent action per state, and charts deferred until practice history exists.

Source: [Aesthetic and Minimalist Design](https://www.nngroup.com/articles/aesthetic-minimalist-design/)

## 3. Keep system status visible

People need timely feedback after actions so they understand what the system is doing and what happened.

**Review questions**

- Is loading, speaking, success, failure, and session progress visible?
- Do asynchronous states use live regions without becoming noisy?
- Does focus move to the next logical task after a state change?

**Applied here:** the catalog has loading and error states, pronunciation reports playing or unavailable status, feedback uses a polite live region, and focus moves from answer to Next Word.

Sources: [Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/), [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)

## 4. Prevent errors and make recovery constructive

Error messages should be close to their source, noticeable through more than color, written in plain language, and explain recovery. Avoid blaming the learner or showing errors prematurely.

**Review questions**

- Does feedback explain what happened and what to do next?
- Are icon, text, border, and color used redundantly?
- Is the learner's effort preserved wherever possible?

**Applied here:** answer submission stays disabled until text exists, incorrect feedback says “Good try,” reveals the spelling and definition, and provides an immediate Next Word action.

Source: [Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)

## 5. Design for children, not generic users

NN/g's three rounds of research with 125 children found that child-focused interfaces still need conventions and consistency. Younger learners favor large simple actions, want fast feedback, skip long instructions, and vary substantially by reading level and age.

**Review questions**

- Is vocabulary appropriate to the selected grade?
- Are instructions short and paired with recognizable icons?
- Are interactions forgiving, direct, and rewarding without becoming distracting?
- Does the layout work well on touch devices?

**Applied here:** grade-targeted content, short Listen/Spell/Grow guidance, labeled icons, untimed practice, repeatable audio, large actions, and encouraging feedback.

Source: [Children's UX: Usability Issues in Designing for Young People](https://www.nngroup.com/articles/childrens-websites-usability-issues/)

## 6. Make touch targets forgiving

NN/g recommends rendered touch targets around 1 cm square with enough separation to avoid accidental activation; children benefit from especially large and easy-to-reach controls.

**Review questions**

- Are controls at least 44–48 CSS pixels tall in common browser configurations?
- Is there sufficient space between opposing or adjacent actions?
- Does the primary action remain easy to reach on a narrow screen?

**Applied here:** interactive controls have a 44-pixel minimum, primary actions are at least 48 pixels tall, practice-style choices are spacious cards, and actions stack on small screens.

Source: [Touch Targets on Touchscreens](https://www.nngroup.com/articles/touch-target-size/)

## 7. Support complete keyboard operation

Keyboard access requires obvious focus, native interactive elements, logical sequential order, access to every control, and a way to bypass repeated navigation.

**Review questions**

- Can the entire task be completed with Tab, Shift+Tab, Enter, and Space?
- Is focus always visible and ordered like the visual layout?
- Can users bypass the header?
- Does a shortcut avoid triggering while a learner is typing?

**Applied here:** native controls, a visible skip link, a high-contrast focus ring, Enter submission, a context-safe Space replay shortcut, and programmatic focus after feedback.

Source: [Keyboard-Only Navigation for Improved Accessibility](https://www.nngroup.com/articles/keyboard-accessibility/)

## 8. Prefer recognition over recall

Controls should communicate purpose without requiring learners to remember hidden behavior. Shortcuts are accelerators, not the only path.

**Applied here:** the replay control combines icon and text, keyboard help is shown beside it, practice modes include descriptions, and the workflow labels each step.

Source: [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)

## Implementation conventions

- Tailwind CSS supplies tokens and utilities through its official Vite plugin.
- Custom styles use BEM names and Tailwind `@apply`; React components do not contain utility-class chains.
- Blocks own their styling, elements use `block__element`, and state variants use `block--modifier`.
- Material UI remains for robust form, dialog, and chart-adjacent primitives.
- `prefers-reduced-motion` disables nonessential motion.
- Playwright and Axe check the ready and active-practice states against WCAG A/AA rules.

Tailwind setup follows the [official Vite installation guide](https://tailwindcss.com/docs/installation/using-vite).
