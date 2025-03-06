import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

GEMINI_API_KEY = "AIzaSyAhZ4akyPxWWL8CluT65Wq-c6wNPk8iuPc"


@csrf_exempt
def chatbot_response(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_message = data.get("message", "")

        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

        headers = {"Content-Type": "application/json"}
        payload = {"contents": [{"parts": [{"text": user_message}]}]}

        response = requests.post(url, headers=headers, json=payload)
        reply = response.json()

        bot_reply = reply.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "Sorry, I didn't understand that.")

        return JsonResponse({"reply": bot_reply})

    return JsonResponse({"error": "Invalid request"}, status=400)
