import sys

from agent import execute_task
from assistant import ask_jarvis
from voice import listen, speak


EXIT_COMMANDS = ("exit", "stop", "quit", "goodbye", "shut down")


def handle(command):
    command = command.strip()
    if not command:
        return "continue"

    if command.lower() in EXIT_COMMANDS:
        print("JARVIS: Goodbye!")
        speak("Goodbye!")
        return "exit"

    task_result = execute_task(command, speak)
    if task_result:
        print("\nJARVIS:", task_result, "\n")
        speak(task_result)
        return "continue"

    reply = ask_jarvis(command)
    print("\nJARVIS:", reply, "\n")
    speak(reply)
    return "continue"


def start_ai():
    print("JARVIS is running...")
    speak("Jarvis online and ready.")

    while True:
        command = listen(timeout=12, phrase_time_limit=8)

        if not command:
            typed_command = input("Type command, or press Enter to listen again: ").strip()
            if not typed_command:
                continue
            command = typed_command

        print("You:", command)

        if handle(command) == "exit":
            break


if __name__ == "__main__":
    if "--voice-test" in sys.argv:
        speak("Jarvis voice test. If you can hear this, voice output is working.")
    else:
        start_ai()
