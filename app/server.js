const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';

app.use(express.json());

// In-memory data so /todos actually does something real
let todos = [
  { id: 1, task: 'Set up CI/CD pipeline', done: false },
  { id: 2, task: 'Deploy to Kubernetes', done: false }
];

let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  next();
});

// Used by Kubernetes liveness AND readiness probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: ENVIRONMENT,
    uptime_seconds: Math.floor(process.uptime())
  });
});

// Prometheus-style plain text metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(
    `# HELP app_requests_total Total number of requests received\n` +
    `# TYPE app_requests_total counter\n` +
    `app_requests_total{environment="${ENVIRONMENT}"} ${requestCount}\n`
  );
});

// Basic CRUD so there's real app logic to test
app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'task is required' });
  }
  const newTodo = { id: todos.length + 1, task, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.get('/', (req, res) => {
  res.json({ message: `Hello from the ${ENVIRONMENT} environment!` });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT} in ${ENVIRONMENT} environment`);
});

module.exports = app;
