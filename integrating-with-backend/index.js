const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
require("dotenv").config();

//IIFE
(async () => {
  // connecting with api of openai
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  //to store previous req & res of user
  const history = [];

  //chat loop
  while (true) {
    //asking for question from user in console
    const userInput = readlineSync.question("Please Enter Your Query: ");

    //going through previous chat history to see if there is some context available
    const messages = [];
    for (const [input_text, completion_text] of history) {
      messages.push({ role: "user", content: input_text });
      messages.push({ role: "assistant", content: completion_text });
    }

    messages.push({ role: "user", content: userInput });
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      //response for ai
      const completion_text = completion.data.choices[0].message.content;
      //consoling the response
      console.log(completion_text);

      history.push([userInput, completion_text]);

      const userInput_again = readlineSync.question(
        "\nWould you like to continue the conversation? (Y/N)"
      );
      if (userInput_again.toUpperCase() === "N") {
        return;
      } else if (userInput_again.toUpperCase() !== "Y") {
        console.log("Invalid input. Please enter 'Y' or 'N'.");
        return;
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }
})();
