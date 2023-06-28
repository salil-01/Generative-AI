const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Define the rate limiter options
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Maximum 10 requests per minute
});
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// Apply the rate limiter middleware to your route
app.use("/poem", limiter);

// Your route to generate the poem
app.post("/poem", async (req, res) => {
  const keyword = req.body.keyword;
  // console.log(keyword);
  let prompt = `Write a Poem on ${keyword} in not more than 30 words`;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.8,
      presence_penalty: 0,
    });
    // console.log(response.data)
    res.send({ res: response.data.choices[0]?.text.trim() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
