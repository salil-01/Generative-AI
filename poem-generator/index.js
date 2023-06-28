const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.post("/poem", async (req, res) => {
  const keyword = req.body.keyword;
  //   console.log(keyword);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt: `Poem about ${keyword}`,
        max_tokens: 100,
        temperature: 0.7,
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
    console.error("Error:", error.response.data);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
