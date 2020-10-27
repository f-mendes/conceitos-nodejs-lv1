const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];



app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const likes = 0;

  const repository = {id: uuid(),title, url, techs, likes};
  if(likes > 0){
    return response.status(400).json({error: "Likes greater than 0 not allowed"})
  }

  repositories.push(repository); 

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({error: "Repository not found."})
  }

  const {likes} = repositories[repoIndex]

  const repoUpdated = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repoIndex] = repoUpdated;


  return response.json(repoUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({error: "Repository not found."})
  }

  repositories.splice(repoIndex);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({error: "Repository not found."})
  }


  let {likes} = repositories[repoIndex];
  likes = likes + 1;

  const repoUpdated = {
    ...repositories[repoIndex],
    likes
  }

  repositories[repoIndex] = repoUpdated;

  return response.status(201).json(repoUpdated);


});


module.exports = app;
