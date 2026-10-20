---
name: voice-engine
description: Best practices and utilities for Indic language Web Speech API TTS and STT.
---

# Voice Engine Skill for Indic Languages

## Language Codes
- Hindi: `hi-IN`
- English: `en-IN`
- Punjabi: `pa-IN`
- Marathi: `mr-IN`

## Speech Synthesis (TTS) Rules
1. Always test `window.speechSynthesis.getVoices()` asynchronously.
2. If `pa-IN` or `mr-IN` voices are missing on the client OS, gracefully fall back to `hi-IN` rather than defaulting to English, because Hindi phonetics are much closer to Punjabi and Marathi Devanagari.
3. Keep rate at `0.9` for clear rural audibility.
4. Always provide an on-screen visual subtitle/caption toast so the user can see what is being spoken even if device audio is muted.

## Speech Recognition (STT) Rules
1. Use `webkitSpeechRecognition` or `SpeechRecognition`.
2. Set continuous to false for quick single-utterance commands.
3. Show animated pulse wave indicator while microphone is active.
