import tkinter as tk
import random

root = tk.Tk()
root.title("JARVIS AI")
root.geometry("800x500")
root.configure(bg="black")

title = tk.Label(root, text="JARVIS", font=("Arial", 24), fg="cyan", bg="black")
title.pack(pady=10)

status = tk.Label(root, text="Idle...", font=("Arial", 14), fg="white", bg="black")
status.pack(pady=5)

canvas = tk.Canvas(root, width=700, height=300, bg="black", highlightthickness=0)
canvas.pack()

bars = []

for i in range(50):
    x = i * 14
    bar = canvas.create_rectangle(x, 150, x + 10, 150, fill="cyan")
    bars.append(bar)

def animate():
    for i, bar in enumerate(bars):
        height = random.randint(10, 200)
        canvas.coords(bar, i*14, 150-height//2, i*14+10, 150+height//2)

    root.after(80, animate)


def set_status(text):
    root.after(0, lambda: status.config(text=text))

animate()
set_status("Idle...")

# IMPORTANT: keep window running but allow import
def run():
    root.mainloop()