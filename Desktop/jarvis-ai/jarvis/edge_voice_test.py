import asyncio
import edge_tts
import os

async def speak():
    communicate = edge_tts.Communicate(
        "Hello Raj. I am Jarvis. How can I help you today?",
        voice="en-US-GuyNeural"
    )

    await communicate.save("jarvis_voice.mp3")

    os.startfile("jarvis_voice.mp3")

asyncio.run(speak())