const express = require('express')
const app = express()
const port = 3000

import { posts, shortList } from "./posts";

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/post', (req, res) => {
  return res.json(
    Object.keys(shortList).map((id) => (shortList[id]))
  );
});

app.get('/post/:postId', (req, res) => {
  return res.json(posts[req.params.postId]);
});

app.post('/post', (req, res) => {
  return res.json({
    id: Math.round(Math.random() * 1000000),
    ...req.body,
  });
});

app.put('/post/:postId', (req, res) => {
  const data = req.body;
  const postId = req.params.postId;
  const foundPost = posts[postId];

  return res.json({ ...foundPost, ...data });
});

app.delete('/post/:postId', (req, res) => {
  const postId = req.params.postId;

  return res.json({ ...posts[req.params.postId] });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
