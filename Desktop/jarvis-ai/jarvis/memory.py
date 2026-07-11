import json
import os

MEMORY_FILE = "memory.json"

def save_memory(key, value):
    memory = load_memory()
    memory[key] = value

    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=4)

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)

    return {}