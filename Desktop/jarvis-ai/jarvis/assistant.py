# from ollama import chat
# from assistant import ask_jarvis

# reply = ask_jarvis(message)

# def ask_jarvis(messages):
#     response = chat(
# model="llama3.2",
# messages=messages
# )

#     return response["message"]["content"]

from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

conversation = [
    {
        "role": "system",
        "content": (
            "You are JARVIS, a helpful voice assistant. "
            "Answer clearly and keep replies short unless the user asks for detail. "
            "Do not claim you can open secure sign-in prompts, connect Gmail, "
            "approve permissions, or access external accounts unless the local app "
            "has actually done it. If the user asks about Gmail, email, mail, "
            "mailbox, or inbox, do not say credentials are missing. Tell the user "
            "to use local commands like 'check my inbox', 'read my last mail', "
            "or 'read unread emails'."
        )
    }
]

def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is missing. Add it to your .env file.")

    return OpenAI(api_key=api_key)

def ask_jarvis(prompt):
    global conversation

    try:
        client = get_client()
        conversation.append({
            "role": "user",
            "content": prompt
        })

        response = client.responses.create(
            model="gpt-5",
            input=conversation
        )

        answer = response.output_text

        conversation.append({
            "role": "assistant",
            "content": answer
        })

        return answer

    except Exception as e:
        print("OpenAI Error:", e)
        return "Sorry, I couldn't connect to OpenAI."
