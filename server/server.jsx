const express=require('express');
const cors=require('cors');

const app=express();
app.use(cors());
app.use(express.json());

app.post("/search", (req, res) => {
  const { query } = req.body;
  console.log("Received query:", query);
  res.json({ status: "success", results: [`Result for ${query}`] });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
