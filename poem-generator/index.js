const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
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

// Apply the rate limiter middleware to your route
app.use("/poem", limiter);

// Your route to generate the poem
app.post("/poem", async (req, res) => {
  const keyword = req.body.keyword;
  //   console.log(keyword);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt: `Write a Poem about ${keyword} in about 30 words`,
        max_tokens: 100,
        temperature: 0.57,
        n: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const poem = response.data.choices[0].text.trim();
    res.json({ poem });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
