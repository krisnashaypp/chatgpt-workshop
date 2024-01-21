# pip install openai
from openai import OpenAI

# token stored in environment variable "OPENAI_API_KEY"
client = OpenAI()

def query_gpt(prompt, model="gpt-3.5-turbo", max_tokens=100):

    try:
        completion = client.chat.completions.create(
            max_tokens=max_tokens,
            model=model,
            messages=[
                #{"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        return completion.choices[0].message.content
    except Exception as e:
        return str(e)

# Example usage
prompt = "Can you tell me a funny joke?"
response = query_gpt(prompt)
print(response)
