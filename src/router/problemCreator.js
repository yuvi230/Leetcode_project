const express = require('express');
const { create } = require('../models/user');
const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');

problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.delete("/:id", deleteProblem);
problemRouter.patch("/:id", updateProblem);

problemRouter.get("/:id", ProblemFetch);
problemRouter.get("/", ProblemFetchAll);
problemRouter.get("/user",SolvedProblem);