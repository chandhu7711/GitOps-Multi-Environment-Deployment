const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);

  await new Promise((resolve) => {
    server.once('listening', resolve);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

test('GET /health returns healthy status', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.strictEqual(response.status, 200);

  const body = await response.json();

  assert.strictEqual(body.status, 'healthy');
});

test('GET / returns environment message', async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.strictEqual(response.status, 200);

  const body = await response.json();

  assert.strictEqual(body.message, 'Hello from the dev environment!');
});

test('GET /todos returns todo list', async () => {
  const response = await fetch(`${baseUrl}/todos`);

  assert.strictEqual(response.status, 200);

  const body = await response.json();

  assert.ok(Array.isArray(body));
  assert.ok(body.length >= 2);
});

test('GET /metrics returns Prometheus metrics', async () => {
  const response = await fetch(`${baseUrl}/metrics`);

  assert.strictEqual(response.status, 200);

  const body = await response.text();

  assert.ok(body.includes('app_requests_total'));
});
