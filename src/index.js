const express = require('express');

const app = express();

app.get("/", (req, res) => {
  return res.json({ message: "Tudo ok" });
});

app.listen(3333);
