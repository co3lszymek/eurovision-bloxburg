const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const countries = [
  "Iceland", "Poland", "Slovenia", "Estonia", "Spain", "Ukraine", "Sweden", "Portugal",
  "Norway", "Belgium", "Italy", "Azerbaijan", "San Marino", "Albania", "Netherlands",
  "Croatia", "Switzerland", "Lithuania"
];

let votes = {};
countries.forEach(country => votes[country] = 0);
let userVotes = {};

app.use(session({ secret: 'supersecretkey', resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  if (!req.session.userId) {
    req.session.userId = Date.now() + Math.random();
    userVotes[req.session.userId] = 0;
  }
  res.render('index', { countries, voted: userVotes[req.session.userId] >= 5 });
});

app.post('/vote', (req, res) => {
  const country = req.body.country;
  const userId = req.session.userId;
  if (userVotes[userId] < 5 && countries.includes(country)) {
    votes[country]++;
    userVotes[userId]++;
  }
  res.redirect('/');
});

app.get('/admin', (req, res) => {
  res.render('admin_login');
});

app.post('/admin', (req, res) => {
  if (req.body.password === 'AdminPanel1234!') {
    res.render('admin', { votes });
  } else {
    res.send('Wrong password.');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
