import os
import webbrowser

import requests
from bs4 import BeautifulSoup

from email_manager import (
    read_latest_unread_email,
    read_unread_email_details,
    read_unread_email_from,
    reply_to_latest_unread_email,
    send_email as send_configured_email,
    start_mail_monitor,
    summarize_unread_emails,
)


_mail_monitor_stop = None


def write_file(filename, content):
    try:
        with open(filename, "w", encoding="utf-8") as file:
            file.write(content)

        return f"File '{filename}' saved successfully."

    except Exception as e:
        return f"Error writing file: {e}"


def read_file(filename):
    try:
        with open(filename, "r", encoding="utf-8") as file:
            return file.read()

    except FileNotFoundError:
        return "File not found."

    except Exception as e:
        return f"Error reading file: {e}"


def delete_file(filename):
    try:
        os.remove(filename)
        return f"File '{filename}' deleted successfully."

    except FileNotFoundError:
        return "File not found."

    except Exception as e:
        return f"Error deleting file: {e}"


def open_application(app_name):
    apps = {
        "brave": r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
        "chrome": [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            "chrome.exe",
        ],
        "chorme": [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            "chrome.exe",
        ],
        "google chrome": [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            "chrome.exe",
        ],
        "notepad": "notepad.exe",
        "calculator": "calc.exe",
        "paint": "mspaint.exe",
        "cmd": "cmd.exe",
        "vscode": r"C:\Users\Dell\AppData\Local\Programs\Microsoft VS Code\Code.exe",
        "spotify": r"C:\Users\Dell\AppData\Roaming\Spotify\Spotify.exe",
        "telegram": r"C:\Users\Dell\AppData\Roaming\Telegram Desktop\Telegram.exe",
        "whatsapp": r"C:\Users\Dell\AppData\Local\WhatsApp\WhatsApp.exe",
    }

    app_name = app_name.lower().strip()

    if app_name in apps:
        paths = apps[app_name]
        if isinstance(paths, str):
            paths = [paths]

        last_error = None

        for path in paths:
            try:
                os.startfile(path)
                return f"Opening {app_name}..."

            except Exception as e:
                last_error = e

        return f"Error opening {app_name}: {last_error}"

    return f"Application '{app_name}' not found."


def open_website(site):
    websites = {
        "youtube": "https://www.youtube.com",
        "you tube": "https://www.youtube.com",
        "google": "https://www.google.com",
        "github": "https://github.com",
        "gmail": "https://mail.google.com",
        "chatgpt": "https://chat.openai.com",
    }

    site = site.lower()

    if site in websites:
        webbrowser.open(websites[site])
        return f"Opening {site}..."

    return "Website not found."


def send_email(receiver, subject, body):
    try:
        return send_configured_email(receiver, subject, body)

    except Exception as e:
        return str(e)


def check_email():
    try:
        return summarize_unread_emails()

    except Exception as e:
        return str(e)


def read_latest_email():
    try:
        return read_latest_unread_email()

    except Exception as e:
        return str(e)


def read_unread_emails():
    try:
        return read_unread_email_details()

    except Exception as e:
        return str(e)


def read_email_from(sender_query):
    try:
        return read_unread_email_from(sender_query)

    except Exception as e:
        return str(e)


def reply_to_latest_email(body):
    try:
        return reply_to_latest_unread_email(body)

    except Exception as e:
        return str(e)


def start_email_monitor(on_new_email=None):
    global _mail_monitor_stop

    if _mail_monitor_stop:
        return "Mail monitor is already running."

    def notify(item):
        if "error" in item:
            message = f"Mail monitor error: {item['error']}"
        else:
            sender = item["from_name"] or item["from"]
            message = f"New email from {sender}: {item['subject']}"

        if on_new_email:
            on_new_email(message)
        else:
            print(message)

    try:
        _mail_monitor_stop = start_mail_monitor(notify)
        return "Mail monitor started."

    except Exception as e:
        return str(e)


def stop_email_monitor():
    global _mail_monitor_stop

    if not _mail_monitor_stop:
        return "Mail monitor is not running."

    _mail_monitor_stop.set()
    _mail_monitor_stop = None
    return "Mail monitor stopped."


def web_search(query):
    try:
        url = f"https://www.google.com/search?q={query}"

        headers = {
            "User-Agent": "Mozilla/5.0",
        }

        response = requests.get(
            url,
            headers=headers,
        )

        soup = BeautifulSoup(
            response.text,
            "html.parser",
        )

        results = []

        for g in soup.find_all("h3")[:5]:
            results.append(g.get_text())

        if results:
            return "\n".join(results)

        return "No results found."

    except Exception as e:
        return f"Search error: {e}"
