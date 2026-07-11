from assistant import ask_jarvis
from agent import execute_task
from wake_word import wait_for_wake_word
from voice import listen, speak

EXIT_COMMANDS = ("exit", "stop", "quit", "goodbye", "shut down")
SLEEP_COMMANDS = ("sleep", "go to sleep", "wait")


def get_user_input():
    missed_count = 0

    while True:
        user_input = listen(timeout=12, phrase_time_limit=8, quiet=missed_count > 0)
        if user_input:
            print("You:", user_input)
            return user_input.strip()

        missed_count += 1

        if missed_count == 4:
            print("Still listening...")
            missed_count = 0


def handle_user_input(user_input):
    command = user_input.lower()

    if command in EXIT_COMMANDS:
        print("JARVIS: Goodbye!")
        speak("Goodbye!")
        return "exit"

    if command in SLEEP_COMMANDS:
        speak("Okay, I will wait.")
        return "sleep"

    task_result = execute_task(user_input, speak)

    if task_result:
        print("\nJARVIS:", task_result, "\n")
        speak(task_result)
        return "continue"

    try:
        reply = ask_jarvis(user_input)
        print("\nJARVIS:", reply, "\n")
        speak(reply)
    except Exception as e:
        print("\nJARVIS Error:", e, "\n")
        speak("Sorry, I had a problem.")

    return "continue"


def conversation_loop():
    speak("Yes sir, how can I help you?")

    while True:
        user_input = get_user_input()
        result = handle_user_input(user_input)

        if result in ("exit", "sleep"):
            return result


print("JARVIS is running...")
print("Say 'Jarvis' to wake me up. Say 'sleep' to wait, or 'stop' to quit.\n")

while True:
    wait_for_wake_word()
    if conversation_loop() == "exit":
        break
