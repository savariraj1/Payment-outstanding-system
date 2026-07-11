from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.json["message"]

    response = {
        "reply": f"JARVIS: {user_message}"
    }

    return jsonify(response)

app.run(host="0.0.0.0", port=5000)