from memory import save_memory, load_memory
from tools import (
    write_file,
    read_file,
    delete_file,
    web_search,
    open_application,
    open_website,
    send_email,
    check_email,
    read_latest_email,
    read_unread_emails,
    read_email_from,
    reply_to_latest_email,
    start_email_monitor,
    stop_email_monitor
)


def execute_task(user_input, notifier=None):
    text = user_input.lower()
    email_words = ("gmail", "mailbox", "email inbox", "inbox", "email", "mail")

    if text in (
        "open inbox",
        "open my inbox",
        "open mail inbox",
        "open my mail inbox",
        "open email inbox",
        "open my email inbox",
        "open gmail inbox",
        "open my gmail inbox",
    ):
        return open_website("gmail")

    if any(word in text for word in email_words):
        if any(word in text for word in ("read", "dictate", "latest")):
            return read_latest_email()

        if any(word in text for word in ("check", "access", "linked", "link", "permission", "summary", "unread", "refresh", "sync", "fetch", "get", "pull")):
            return check_email()

        if "open" in text and "inbox" in text:
            return open_website("gmail")

    if text in (
        "read all unread emails",
        "read unread emails",
        "read my unread emails",
        "dictate unread emails",
        "dictate my unread emails",
    ):
        return read_unread_emails()

    if text in (
        "read latest email",
        "read latest mail",
        "read last email",
        "read last mail",
        "read my latest email",
        "read my latest mail",
        "read my last email",
        "read my last mail",
        "what was the latest email",
        "what was the latest mail",
        "what was the last email",
        "what was the last mail",
        "what is the latest email",
        "what is the latest mail",
        "what is the last email",
        "what is the last mail",
        "what is my latest email",
        "what is my latest mail",
        "what is my last email",
        "what is my last mail",
        "dictate latest email",
        "dictate latest mail",
        "dictate my latest email",
        "dictate my latest mail",
    ):
        return read_latest_email()

    if text.startswith("read email from "):
        sender = user_input[len("read email from "):].strip()
        return read_email_from(sender)

    if text.startswith("read mail from "):
        sender = user_input[len("read mail from "):].strip()
        return read_email_from(sender)

    # Remember information
    if text.startswith("remember that"):
        info = user_input[len("remember that"):].strip()

        if " is " in info:
            key, value = info.split(" is ", 1)

            save_memory(key.strip().lower(), value.strip())

            return f"I will remember that {key.strip()} is {value.strip()}."

        return "Please use: Remember that <something> is <value>"

    # Recall information
    elif text.startswith("what is my"):
        key = user_input[len("What is my"):].replace("?", "").strip().lower()

        memory = load_memory()

        if key in memory:
            return f"Your {key} is {memory[key]}."

        return "I don't know that yet."

    # Create file
    elif "create a file called" in text:
        filename = text.replace(
            "create a file called", ""
        ).strip()

        return write_file(
            filename,
            "This file was created by JARVIS."
        )

    # Read file
    elif text.startswith("read "):
        filename = text.replace("read", "").strip()
        return read_file(filename)

    # Delete file
    elif text.startswith("delete "):
        filename = text.replace("delete", "").strip()
        return delete_file(filename)

    # Web search
    elif text.startswith("search for "):
        query = text.replace("search for", "").strip()
        return web_search(query)

    # Check unread email
    elif text in (
        "check email",
        "check mail",
        "check mailbox",
        "check my email",
        "check my mail",
        "check my mailbox",
        "check gmail",
        "check my gmail",
        "read email",
        "read mail",
    ):
        return check_email()

    elif text in (
        "read latest email",
        "read latest mail",
        "read last email",
        "read last mail",
        "read my latest email",
        "read my latest mail",
        "read my last email",
        "read my last mail",
        "what was the latest email",
        "what was the latest mail",
        "what was the last email",
        "what was the last mail",
        "what is the latest email",
        "what is the latest mail",
        "what is the last email",
        "what is the last mail",
        "what is my latest email",
        "what is my latest mail",
        "what is my last email",
        "what is my last mail",
        "dictate latest email",
        "dictate latest mail",
        "dictate my latest email",
        "dictate my latest mail",
    ):
        return read_latest_email()

    elif text in ("unread today", "read today", "today unread", "today's unread"):
        return check_email()

    elif text in (
        "read all unread emails",
        "read unread emails",
        "read my unread emails",
        "dictate unread emails",
        "dictate my unread emails",
    ):
        return read_unread_emails()

    elif text.startswith("read email from "):
        sender = user_input[len("read email from "):].strip()
        return read_email_from(sender)

    elif text.startswith("read mail from "):
        sender = user_input[len("read mail from "):].strip()
        return read_email_from(sender)

    # Monitor unread email
    elif text in ("start mail monitor", "start email monitor", "monitor mail", "monitor email"):
        return start_email_monitor(notifier)

    elif text in ("stop mail monitor", "stop email monitor"):
        return stop_email_monitor()

    # Reply to latest unread email
    elif text.startswith("reply to latest email body "):
        body = user_input[len("reply to latest email body "):].strip()
        return reply_to_latest_email(body)

    elif text.startswith("reply to latest mail body "):
        body = user_input[len("reply to latest mail body "):].strip()
        return reply_to_latest_email(body)

    # Open website
    elif text.startswith("open ") and text.replace("open", "", 1).strip() in ("youtube", "you tube", "google", "github", "gmail", "chatgpt"):
        site = text.replace("open", "", 1).strip()
        return open_website(site)

    # Open application
    elif text.startswith("open "):
        app = text.replace("open", "", 1).strip()
        return open_application(app)

    # Open website
    elif text.startswith("go to "):
        site = text.replace("go to", "", 1).strip()
        return open_website(site)

    # Send email
    elif text.startswith("send email to"):
        try:
            parts = user_input.split(" subject ")

            receiver = parts[0].replace(
                "send email to", ""
            ).strip()

            subject_body = parts[1].split(" body ")

            subject = subject_body[0].strip()
            body = subject_body[1].strip()

            return send_email(
                receiver,
                subject,
                body
            )

        except Exception:
            return (
                "Invalid format.\n"
                "Use: Send email to <person> "
                "subject <subject> body <message>"
            )

    return None
