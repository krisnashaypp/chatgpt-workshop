import http.client
import json

api_key = "<your-api-key>"

def query_openai(prompt):
    
    params = json.dumps({
        "model": "gpt-3.5-turbo",
        "messages": [
            #{"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 100
    })

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    connection = http.client.HTTPSConnection("api.openai.com")
    connection.request("POST", "/v1/chat/completions", params, headers)
    response = connection.getresponse()

    result = json.loads(response.read().decode())
    connection.close()
    return result["choices"][0]["message"]["content"]

# Example usage
prompt = "Can you tell me a joke?"
response = query_openai(prompt)
print(response)