import requests

GEMINI_API_KEY = "AIzaSyAhZ4akyPxWWL8CluT65Wq-c6wNPk8iuPc"

url = f"https://generativelanguage.googleapis.com/v1/models?key={GEMINI_API_KEY}"
response = requests.get(url)

print(response.json())  # Check available models
