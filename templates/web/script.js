async function queryOpenAI(prompt) {

    // Insert your API key here
    const apiKey = '<your-api-key-here>'; 

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ 
                model: "gpt-3.5-turbo",
                messages: [
                    //{"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ] 
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error querying OpenAI:', error);
    }
}

// Example usage
queryOpenAI("Can you tell me a joke?")
    .then(answer => {
        if (answer != undefined) {
            document.querySelector("#chatgpt_output").innerHTML = answer;
        } else {
            document.querySelector("#chatgpt_output").innerHTML = "Something went wrong";
        }
    });