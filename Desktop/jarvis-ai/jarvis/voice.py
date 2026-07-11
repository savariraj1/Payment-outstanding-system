import asyncio
import os
import tempfile
import time

import edge_tts
import pygame
import pyttsx3
import speech_recognition as sr

recognizer = sr.Recognizer()
recognizer.dynamic_energy_threshold = True
_fallback_engine = None


def listen(timeout=8, phrase_time_limit=10, quiet=False):
    with sr.Microphone() as source:
        if not quiet:
            print("Listening...")
        recognizer.adjust_for_ambient_noise(source, duration=0.2)

        try:
            audio = recognizer.listen(
                source,
                timeout=timeout,
                phrase_time_limit=phrase_time_limit
            )
            text = recognizer.recognize_google(audio).lower()
            if not quiet:
                print("Recognized:", text)
            return text
        except sr.WaitTimeoutError:
            if not quiet:
                print("No speech detected.")
            return ""
        except sr.UnknownValueError:
            if not quiet:
                print("I could not understand that.")
            return ""
        except sr.RequestError as e:
            print("Speech recognition error:", e)
            return ""
        except Exception as e:
            print("Microphone error:", e)
            return ""


def speak(text):
    if not text:
        return

    audio_path = None

    def fallback_speak(reason=None):
        global _fallback_engine

        if reason:
            print("Voice playback fallback:", reason)

        try:
            if _fallback_engine is None:
                _fallback_engine = pyttsx3.init("sapi5")

            _fallback_engine.say(text)
            _fallback_engine.runAndWait()
        except Exception as e:
            print("Fallback voice error:", e)
            print("JARVIS:", text)

    async def generate():
        nonlocal audio_path
        audio_file = tempfile.NamedTemporaryFile(
            suffix=".mp3",
            delete=False
        )
        audio_path = audio_file.name
        audio_file.close()

        communicate = edge_tts.Communicate(
            text,
            voice="en-US-AriaNeural"
        )
        await communicate.save(audio_path)

    try:
        asyncio.run(generate())
    except Exception as e:
        fallback_speak(e)
        return

    try:
        if not pygame.mixer.get_init():
            pygame.mixer.init()
    except Exception as e:
        fallback_speak(e)
        return

    try:
        if not audio_path:
            return

        pygame.mixer.music.load(audio_path)
        pygame.mixer.music.play()

        started_at = time.time()
        max_seconds = 60

        while pygame.mixer.music.get_busy():
            if time.time() - started_at > max_seconds:
                print("Voice playback timed out.")
                break
            pygame.time.Clock().tick(10)

    except Exception as e:
        fallback_speak(e)

    finally:
        pygame.mixer.music.stop()
        pygame.mixer.music.unload()

        if audio_path and os.path.exists(audio_path):
            for _ in range(5):
                try:
                    os.remove(audio_path)
                    break
                except PermissionError:
                    time.sleep(0.1)
