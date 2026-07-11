import tkinter as tk
from tkinter import scrolledtext
import os

window = tk.Tk()
window.title("JARVIS AI")
window.geometry("1000x700")
window.geometry("900x650")
window.configure(bg="#1e1e1e")

# ---------------- Header ----------------

header = tk.Frame(window, bg="#202123", height=60)
header.pack(fill="x")

title = tk.Label(
    header,
    text="🤖 JARVIS AI",
    bg="#202123",
    fg="white",
    font=("Segoe UI", 18, "bold")
)

title.pack(side="left", padx=20, pady=15)

# ---------------- Chat Area ----------------

chat = scrolledtext.ScrolledText(
    window,
    bg="#343541",
    fg="white",
    insertbackground="white",
    font=("Segoe UI", 12),
    wrap="word"
)

chat.pack(fill="both", expand=True, padx=10, pady=10)

chat.insert("end", "🤖 Welcome to JARVIS AI\n\n")

# ---------------- Bottom ----------------

bottom = tk.Frame(window, bg="#202123")
bottom.pack(fill="x")

entry = tk.Entry(
    bottom,
    font=("Segoe UI", 13),
    bg="#40414F",
    fg="white",
    insertbackground="white"
)

entry.pack(side="left", fill="x", expand=True, padx=10, pady=10)


def send():

    message = entry.get()

    if message == "":
        return

    chat.insert("end", f"\n👤 You: {message}\n")

    # Later connect this to assistant.py
    reply = "Processing..."

    chat.insert("end", f"🤖 JARVIS: {reply}\n\n")

    entry.delete(0, "end")

send_btn = tk.Button(
    bottom,
    text="➤",
    font=("Segoe UI", 14),
    command=send,
    bg="#19c37d",
    fg="white"
)

send_btn.pack(side="right", padx=10)

window.mainloop()

# # =====================
# # 📁 File Manager
# # =====================

# left_frame = tk.Frame(window)
# left_frame.pack(side=tk.LEFT, fill=tk.Y)

# title = tk.Label(left_frame, text="📁 File Manager")
# title.pack()

# file_list = tk.Listbox(left_frame, width=30)
# file_list.pack(fill=tk.Y, expand=True)

# # Show files in current folder
# for file in os.listdir("."):
#     file_list.insert(tk.END, file)
# # Text editor
# editor = tk.Text(window, wrap=tk.WORD)
# editor.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

# current_file = None


# def refresh_files():
#     file_list.delete(0, tk.END)

#     for file in os.listdir("."):
#         file_list.insert(tk.END, file)


# def open_file(event=None):
#     global current_file

#     selected = file_list.curselection()

#     if not selected:
#         return

#     current_file = file_list.get(selected[0])

#     if os.path.isfile(current_file):
#         try:
#             with open(current_file, "r", encoding="utf-8") as f:
#                 content = f.read()

#             editor.delete("1.0", tk.END)
#             editor.insert(tk.END, content)

#         except Exception as e:
#             messagebox.showerror("Error", str(e))


# def save_file():
#     global current_file

#     if current_file:
#         with open(current_file, "w", encoding="utf-8") as f:
#             f.write(editor.get("1.0", tk.END))

#         messagebox.showinfo("Saved", f"{current_file} saved.")


# def create_file():
#     filename = simpledialog.askstring(
#         "New File",
#         "Enter file name:"
#     )

#     if filename:
#         open(filename, "w").close()
#         refresh_files()


# def create_folder():
#     folder = simpledialog.askstring(
#         "New Folder",
#         "Enter folder name:"
#     )

#     if folder:
#         os.makedirs(folder, exist_ok=True)
#         refresh_files()


# def delete_selected():
#     selected = file_list.curselection()

#     if not selected:
#         return

#     item = file_list.get(selected[0])

#     confirm = messagebox.askyesno(
#         "Delete",
#         f"Delete {item}?"
#     )

#     if confirm:
#         try:
#             if os.path.isfile(item):
#                 os.remove(item)

#             elif os.path.isdir(item):
#                 os.rmdir(item)

#             refresh_files()

#         except Exception as e:
#             messagebox.showerror("Error", str(e))


# # Double-click to open
# file_list.bind("<Double-Button-1>", open_file)

# # Buttons
# btn_frame = tk.Frame(left_frame)
# btn_frame.pack(pady=10)

# tk.Button(
#     btn_frame,
#     text="➕ File",
#     command=create_file
# ).pack(fill=tk.X)

# tk.Button(
#     btn_frame,
#     text="📁 Folder",
#     command=create_folder
# ).pack(fill=tk.X)

# tk.Button(
#     btn_frame,
#     text="💾 Save",
#     command=save_file
# ).pack(fill=tk.X)

# tk.Button(
#     btn_frame,
#     text="🗑️ Delete",
#     command=delete_selected
# ).pack(fill=tk.X)

# refresh_files()
# window.mainloop()
