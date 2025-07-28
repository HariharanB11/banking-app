const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('# HELP banking_app_requests_total Total requests\nbanking_app_requests_total 1');
});

app.listen(port, () => {
  console.log(`Banking App listening at http://localhost:${port}`);
});
