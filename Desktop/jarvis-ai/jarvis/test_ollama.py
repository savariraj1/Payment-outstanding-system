import requests

res = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "llama3",
        "prompt": "Hello",
        "stream": False
    }
)

print(res.text)