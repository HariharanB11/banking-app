const express = require('express');
const app = express();
const port = 3000;

// Health Check
app.get('/', (req, res) => {
  res.send('Welcome to Banking App');
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('# HELP banking_app_requests_total Total requests\nbanking_app_requests_total 1');
});

app.listen(port, () => {
  console.log(`Banking App listening at http://localhost:${port}`);
});
