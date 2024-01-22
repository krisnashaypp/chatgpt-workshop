// npm install
// Set the OPENAI_API_KEY environment variable.

import OpenAI from 'openai';
const openai = new OpenAI();

async function queryGPT(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                //{"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Example usage
queryGPT("Can you tell me a funny joke?")
    .then(response => console.log(response))
    .catch(err => console.error(err));