import speech_recognition as sr

recognizer = sr.Recognizer()
WAKE_WORDS = [
    "jarvis",
    "service",
    "travis",
    "wake up"
]

def wait_for_wake_word():
    print("Waiting for wake word...")

    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.3)

        while True:
            
            try:
                audio = recognizer.listen(
                    source,
                    timeout=5,
                    phrase_time_limit=2
                )
                text = recognizer.recognize_google(audio).lower()

                if any(word in text for word in WAKE_WORDS):
                    print("Wake word detected!")
                    return True

            except sr.WaitTimeoutError:
                pass

            except Exception:
                pass
