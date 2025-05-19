const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const countries = [
  { code: "IS", name: "Iceland", emoji: "🇮🇸" },
  { code: "PL", name: "Poland", emoji: "🇵🇱" },
  { code: "SI", name: "Slovenia", emoji: "🇸🇮" },
  { code: "EE", name: "Estonia", emoji: "🇪🇪" },
  { code: "ES", name: "Spain", emoji: "🇪🇸" },
  { code: "UA", name: "Ukraine", emoji: "🇺🇦" },
  { code: "SE", name: "Sweden", emoji: "🇸🇪" },
  { code: "PT", name: "Portugal", emoji: "🇵🇹" },
  { code: "NO", name: "Norway", emoji: "🇳🇴" },
  { code: "BE", name: "Belgium", emoji: "🇧🇪" },
  { code: "IT", name: "Italy", emoji: "🇮🇹" },
  { code: "AZ", name: "Azerbaijan", emoji: "🇦🇿" },
  { code: "SM", name: "San Marino", emoji: "🇸🇲" },
  { code: "AL", name: "Albania", emoji: "🇦🇱" },
  { code: "NL", name: "Netherlands", emoji: "🇳🇱" },
  { code: "HR", name: "Croatia", emoji: "🇭🇷" },
  { code: "CH", name: "Switzerland", emoji: "🇨🇭" },
  { code: "LT", name: "Lithuania", emoji: "🇱🇹" }
];

let votes = {};
countries.forEach(c => votes[c.code] = 0);

let userVotes = {};

app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  if (!req.session.userId) {
    req.session.userId = Date.now() + Math.random();
    userVotes[req.session.userId] = 0;
  }
  res.render('index', {
    countries,
    voted: userVotes[req.session.userId] >= 5
  });
});

app.post('/vote', (req, res) => {
  const country = req.body.country;
  const userId = req.session.userId;

  if (userVotes[userId] < 5 && countries.some(c => c.code === country)) {
    votes[country]++;
    userVotes[userId]++;
  }

  res.redirect('/');
});

app.get('/admin', (req, res) => {
  res.render('admin_login', { error: null });
});

app.post('/admin', (req, res) => {
  if (req.body.password === 'AdminPanel1234!') {
    res.render('admin', { votes, countries });
  } else {
    res.render('admin_login', { error: 'Wrong password.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
