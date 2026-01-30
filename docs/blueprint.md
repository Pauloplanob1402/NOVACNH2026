# **App Name**: BrainShift Quiz

## Core Features:

- Data Safety Interface: Defines a TypeScript interface to ensure the correct data structure based on 'questoes_shift.json', including metadata, levels, and alternatives.
- State Management with Local Storage: Uses 'useState' to manage the current question and XP, storing everything in LocalStorage for persistent data.
- Dynamic Quiz Display: Presents quiz questions and answer options retrieved from JSON data.
- Safe Audio Playback: Implements 'playSound(type)' to call audio files from /public/sounds/ without causing interface interruptions if audio fails.
- Feedback Visualization: Shows user feedback after each answer based on brain type (Reptilian, Limbic, or Neocortex), influenced by points earned.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) to stimulate intellect and reflection.
- Background color: Soft lavender (#EDE7F6), a lighter tint of the primary color, promoting focus and calm.
- Accent color: Vibrant pink (#E91E63), for feedback highlights and interaction elements.
- Body and headline font: 'Inter' for clear and accessible reading experience.
- Use brain-themed icons for question categories and feedback indicators.
- Employ subtle animations during question transitions and when providing user feedback.