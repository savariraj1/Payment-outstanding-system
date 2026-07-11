from voice import listen, speak

speak("Hello. I am JARVIS.")

while True:

    user = listen()

    if user.lower() == "exit":
        speak("Goodbye.")
        break

    speak(f"You said {user}")