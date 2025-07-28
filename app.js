const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/health', (req, res) => res.send('OK'));
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('# HELP banking_app_requests_total Total requests\nbanking_app_requests_total 1');
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(port, () => {
  console.log(`Banking App running at http://localhost:${port}`);
});
