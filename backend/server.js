const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [id] = await db("users").insert({
      username,
      password: hashedPassword,
    });
    res.status(201).json({ id, username });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db("users").where({ username }).first();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token, user: { id: user.id, username: user.username } });
});

// Project Routes
app.get("/api/projects", auth, async (req, res) => {
  const projects = await db("projects").where({ user_id: req.user.id });
  res.json(projects);
});

app.post("/api/projects", auth, async (req, res) => {
  const { name } = req.body;
  const [id] = await db("projects").insert({ name, user_id: req.user.id });
  const project = await db("projects").where({ id }).first();
  res.status(201).json(project);
});

app.put("/api/projects/:id", auth, async (req, res) => {
  const { name } = req.body;
  await db("projects")
    .where({ id: req.params.id, user_id: req.user.id })
    .update({ name });
  const project = await db("projects").where({ id: req.params.id }).first();
  res.json(project);
});

app.delete("/api/projects/:id", auth, async (req, res) => {
  await db("projects")
    .where({ id: req.params.id, user_id: req.user.id })
    .delete();
  res.json({ success: true });
});

// Todo Routes
app.get("/api/todos", auth, async (req, res) => {
  const { project_id } = req.query;
  const query = db("todos").where({ user_id: req.user.id });
  if (project_id) query.where({ project_id });

  // Sort: Incomplete first, then by created_at (oldest first)
  const todos = await query.orderBy([
    { column: "completed", order: "asc" },
    { column: "created_at", order: "asc" },
  ]);
  res.json(todos);
});

app.post("/api/todos", auth, async (req, res) => {
  const { title, description, priority, project_id } = req.body;
  const [id] = await db("todos").insert({
    title,
    description,
    priority: priority || "medium",
    project_id,
    user_id: req.user.id,
    completed: false,
  });
  const todo = await db("todos").where({ id }).first();
  res.status(201).json(todo);
});

app.put("/api/todos/:id", auth, async (req, res) => {
  const { title, description, priority, completed } = req.body;
  const updateData = { title, description, priority, completed };

  if (completed !== undefined) {
    updateData.completed_at = completed ? new Date() : null;
  }

  await db("todos")
    .where({ id: req.params.id, user_id: req.user.id })
    .update(updateData);
  const todo = await db("todos").where({ id: req.params.id }).first();
  res.json(todo);
});

app.delete("/api/todos/:id", auth, async (req, res) => {
  await db("todos").where({ id: req.params.id, user_id: req.user.id }).delete();
  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
