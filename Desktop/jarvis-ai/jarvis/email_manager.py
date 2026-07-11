import email
import imaplib
import os
import smtplib
import threading
import time
from email.message import EmailMessage
from email.utils import parseaddr
from dotenv import load_dotenv

load_dotenv()


EMAIL_ADDRESS_ENV = "JARVIS_EMAIL_ADDRESS"
EMAIL_PASSWORD_ENV = "JARVIS_EMAIL_PASSWORD"


def _short_preview(text, limit=180):
    preview = " ".join((text or "").split())

    if not preview:
        return "No readable preview."

    if len(preview) <= limit:
        return preview

    return preview[:limit].rstrip() + "..."


def _get_email_config():
    address = os.getenv(EMAIL_ADDRESS_ENV)
    password = os.getenv(EMAIL_PASSWORD_ENV)

    if not address or not password:
        raise RuntimeError(
            "Email is not configured. Set JARVIS_EMAIL_ADDRESS and "
            "JARVIS_EMAIL_PASSWORD first."
        )

    return {
        "address": address,
        "password": password,
        "smtp_host": os.getenv("JARVIS_SMTP_HOST", "smtp.gmail.com"),
        "smtp_port": int(os.getenv("JARVIS_SMTP_PORT", "465")),
        "imap_host": os.getenv("JARVIS_IMAP_HOST", "imap.gmail.com"),
    }


def _plain_text_from_message(message):
    if message.is_multipart():
        for part in message.walk():
            if part.get_content_type() == "text/plain" and "attachment" not in str(part.get("Content-Disposition")):
                return part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="replace")
        return ""

    return message.get_payload(decode=True).decode(message.get_content_charset() or "utf-8", errors="replace")


def _connect_imap():
    config = _get_email_config()
    mailbox = imaplib.IMAP4_SSL(config["imap_host"])
    mailbox.login(config["address"], config["password"])
    mailbox.select("INBOX")
    return mailbox


def send_email(to_email, subject, message, reply_to_message=None):
    config = _get_email_config()

    msg = EmailMessage()
    msg["From"] = config["address"]
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(message)

    if reply_to_message:
        message_id = reply_to_message.get("message_id")
        references = reply_to_message.get("references")

        if message_id:
            msg["In-Reply-To"] = message_id
            msg["References"] = f"{references} {message_id}".strip() if references else message_id

    with smtplib.SMTP_SSL(config["smtp_host"], config["smtp_port"]) as smtp:
        smtp.login(config["address"], config["password"])
        smtp.send_message(msg)

    return "Email sent successfully."


def get_unread_emails(limit=5, mark_seen=False):
    mailbox = None

    try:
        mailbox = _connect_imap()
        status, data = mailbox.search(None, "UNSEEN")

        if status != "OK":
            return []

        message_ids = data[0].split()[-limit:]
        unread = []

        for message_id in reversed(message_ids):
            status, message_data = mailbox.fetch(message_id, "(RFC822)")
            if status != "OK":
                continue

            raw_message = message_data[0][1]
            parsed = email.message_from_bytes(raw_message)
            sender_name, sender_email = parseaddr(parsed.get("From", ""))

            unread.append({
                "imap_id": message_id.decode(),
                "from": sender_email,
                "from_name": sender_name,
                "subject": parsed.get("Subject", "(no subject)"),
                "body": _plain_text_from_message(parsed).strip(),
                "message_id": parsed.get("Message-ID"),
                "references": parsed.get("References"),
            })

            if not mark_seen:
                mailbox.store(message_id, "-FLAGS", "\\Seen")

        return unread

    finally:
        if mailbox:
            mailbox.close()
            mailbox.logout()


def summarize_unread_emails(limit=5):
    unread = get_unread_emails(limit=limit)

    if not unread:
        return "No unread emails found."

    lines = [f"You have {len(unread)} unread email(s)."]

    for index, item in enumerate(unread, start=1):
        sender = item["from_name"] or item["from"]
        preview = _short_preview(item["body"])
        lines.append(
            f"Email {index}. From {sender}. "
            f"Subject: {item['subject']}. Overview: {preview}"
        )

    return "\n".join(lines)


def read_unread_email_details(limit=3, mark_seen=False):
    unread = get_unread_emails(limit=limit, mark_seen=mark_seen)

    if not unread:
        return "No unread emails found."

    lines = [f"Reading {len(unread)} unread email(s)."]

    for index, item in enumerate(unread, start=1):
        sender = item["from_name"] or item["from"]
        body = item["body"] or "This email has no readable text content."
        lines.append(
            f"Email {index}. From {sender}. "
            f"Subject: {item['subject']}. Message: {body}"
        )

    return "\n\n".join(lines)


def read_latest_unread_email(mark_seen=True):
    unread = get_unread_emails(limit=1, mark_seen=mark_seen)

    if not unread:
        return "No unread email found."

    latest = unread[0]
    sender = latest["from_name"] or latest["from"]
    body = latest["body"] or "This email has no readable text content."

    return (
        f"Latest email from {sender}. "
        f"Subject: {latest['subject']}. "
        f"Message: {body}"
    )


def read_unread_email_from(sender_query, mark_seen=True):
    unread = get_unread_emails(limit=10, mark_seen=mark_seen)
    sender_query = sender_query.lower().strip()

    for item in unread:
        sender_name = item["from_name"] or ""
        sender_email = item["from"] or ""

        if sender_query in sender_name.lower() or sender_query in sender_email.lower():
            body = item["body"] or "This email has no readable text content."
            sender = sender_name or sender_email

            return (
                f"Email from {sender}. "
                f"Subject: {item['subject']}. "
                f"Message: {body}"
            )

    return f"No unread email found from {sender_query}."


def reply_to_latest_unread_email(message):
    unread = get_unread_emails(limit=1)

    if not unread:
        return "No unread email found to reply to."

    latest = unread[0]
    subject = latest["subject"]

    if not subject.lower().startswith("re:"):
        subject = f"Re: {subject}"

    return send_email(
        latest["from"],
        subject,
        message,
        reply_to_message=latest
    )


def start_mail_monitor(on_new_email, interval_seconds=60):
    stop_event = threading.Event()

    def monitor():
        seen_ids = set()

        while not stop_event.is_set():
            try:
                for item in get_unread_emails(limit=10):
                    unique_id = item.get("message_id") or item["imap_id"]

                    if unique_id not in seen_ids:
                        seen_ids.add(unique_id)
                        on_new_email(item)

            except Exception as e:
                on_new_email({"error": str(e)})

            stop_event.wait(interval_seconds)

    thread = threading.Thread(target=monitor, daemon=True)
    thread.start()
    return stop_event
