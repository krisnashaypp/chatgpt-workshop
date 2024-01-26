const chatgptFunction = {
  "type": "function",
  "function": {
    "name": "create_quiz",
    "parameters": {
      "type": "object",
      "properties": {
        "quiz_questions": {
          "type": "array",
          "description": "Array of quiz questions",
          "items": {
            "type": "object",
            "properties": {
              "question": {
                "type": "string",
                "description": "The quiz question"
              },
              "answers": {
                "type": "array",
                "description": "Array of possible answers for the question",
                "items": {
                  "type": "object",
                  "properties": {
                    "text": {
                      "type": "string",
                      "description": "The answer text"
                    },
                    "isCorrect": {
                      "type": "boolean",
                      "description": "Flag indicating if the answer is correct"
                    }
                  },
                  "required": ["text", "isCorrect"]
                }
              }
            },
            "required": ["question", "answers"]
          }
        }
      },
      "required": ["quiz_questions"]
    },
    "description": "Creates a set of quiz questions, each with multiple choice answers"
  }
};


const btn = document.querySelector(".quiz-input-container button");

async function queryOpenAI(prompt) {
  // Insert your API key here
  const apiKey = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {"role": "system", "content": "You are a quiz making machine, you will receive a prompt that has the subject you want to create a quiz for and the number of questions you should produce"},
          { role: "user", content: prompt },
        ],
        tools: [chatgptFunction],
        tool_choice: { type: "function", function: { name: "create_quiz" } },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data.choices[0].message.tool_calls[0].function.arguments;
  } catch (error) {
    console.error("Error querying OpenAI:", error);
  }
}


function createQuestionDiv(question, answers) {
  const questionDiv = document.createElement("div");
  const questionHeader = document.createElement("h2");
  questionHeader.innerText = question;
  questionDiv.appendChild(questionHeader);

  const answerButtonsDiv = document.createElement("div");
  answerButtonsDiv.classList.add("answers-container");
  for (const answer of answers) {
    const answerBtn = document.createElement("button");
    answerBtn.innerText = answer.text;
    answerButtonsDiv.appendChild(answerBtn);

    answerBtn.addEventListener("click", () => {
      const answerIsCorrectHeader = questionDiv.querySelector("h3");
      if (answer.isCorrect) {
        answerIsCorrectHeader.innerHTML = "Correct!";
      } else {
        answerIsCorrectHeader.innerHTML = "Incorrect!";
      }
     
      //disable all btns after 1 is clicked
      const answerButtons = answerButtonsDiv.querySelectorAll("button");
      answerButtons.forEach(button => {
        button.disabled = true;
        button.classList.add("disabled");
      });
    });
  }

  questionDiv.appendChild(document.createElement("h3"));
  
  questionDiv.appendChild(answerButtonsDiv);

  return questionDiv;
}

btn.addEventListener("click", async () => {
  const inputQuestion = document.querySelectorAll(".quiz-input-container input")[0];
  const inputNumber = document.querySelectorAll(".quiz-input-container input")[1];
  const quizQuestionContainer = document.querySelector(".quiz-container");
  try {
    const response = await queryOpenAI(`Make a quiz about: ${inputQuestion.value} number of questions must be ${inputNumber.value ?? 3}`);
    const responseFormatted = JSON.parse(response);
    console.log(response, responseFormatted);

 
    quizQuestionContainer.innerHTML = "";

    for (const question of responseFormatted.quiz_questions) {
      quizQuestionContainer.appendChild(createQuestionDiv(question.question, question.answers));
    }


  
  } catch (error) {
    console.log(error);
  }
});
