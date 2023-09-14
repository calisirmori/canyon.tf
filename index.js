const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { fetch, FetchResultTypes, FetchMethods } = require("@sapphire/fetch");
const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
const cookieParser = require('cookie-parser');
const fs = require('fs');
const Pool = require('pg').Pool
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'Whatever_You_Want',
  saveUninitialized: true,
  resave: false,
  cookie: {
   maxAge: 31556952000
  }
 }))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
 // Required to get data from user for sessions
passport.serializeUser((user, done) => {
  done(null, user);
 });
 passport.deserializeUser((user, done) => {
  done(null, user);
 });

passport.use(new SteamStrategy({
 returnURL: 'https://canyon-tf-site-dg3ts.ondigitalocean.app/api/auth/steam/return',
 realm: 'https://canyon-tf-site-dg3ts.ondigitalocean.app',
 apiKey: `${process.env.STEAMKEY}`
 }, function (identifier, profile, done) {
  process.nextTick(function () {
   profile.identifier = identifier;
   return done(null, profile);
  });
 }
));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Steam login 
app.get('/api/steam', (req, res) => {
 res.send(req.user);
});

app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/api/steam'}), function (req, res) {
 res.redirect('/api/steam')
});

app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/api/steam'}), function (req, res) {
  res.cookie('userid', res.req.user.id , { maxAge: 900000, httpOnly: true });
  res.redirect(`/profile/${res.req.user.id}`)
});

const pool = new Pool({
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: {
    ca: fs.readFileSync("./ca-certificate.crt")
  },
})

app.get('/api/testdb', (req, response) => {
  pool.query(`SELECT * FROM match ORDER BY matchid DESC LIMIT 2`)
  .then((res) => response.send(res))
  .catch((err) => console.error(err))
});

app.get('/api/check-vote', (req, response) => {
  const userid = req.query.userid;
  const matchid = req.query.matchid;

  const sql = 'SELECT * FROM predictions WHERE steamid = $1 AND matchid = $2';  // Use a parameterized query with both userid and matchid

  pool.query(sql, [userid, matchid])
  .then((res) => response.send(res.rows))
  .catch((err) => console.error(err));
});

app.get('/api/community-average', (req, response) => {
  const matchID = req.query.matchid;
  const sql = `
  SELECT
    FLOOR(avg(scout_prediction)) as SCOUT,
    FLOOR(avg(soldier_prediction)) as SOLDIER,
    FLOOR(avg(pyro_prediction)) as PYRO,
    FLOOR(avg(demo_prediction)) as DEMO,
    FLOOR(avg(heavy_prediction)) as HEAVY,
    FLOOR(avg(engi_prediction)) as ENGI,
    FLOOR(avg(medic_prediction)) as MEDIC,
    FLOOR(avg(sniper_prediction)) as SNIPER,
    FLOOR(avg(spy_prediction)) as SPY
  FROM predictions
  WHERE matchid=$1`;

pool.query(sql, [matchID])
.then((res) => response.send(res.rows))
.catch((err) => console.error(err));
});

app.post('/api/testwrite', (req, response) => {
  const { playerID, matchID, scout, soldier, pyro, demoman, heavy, engineer, medic, sniper, spy, pointsEarned } = req.body;
  const values = [playerID, matchID, scout, soldier, pyro, demoman, heavy, engineer, medic, sniper, spy, pointsEarned ];
  const queryString = 'INSERT INTO predictions VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
  pool.query(queryString, values)
  .then((res) => response.send(res))
  .catch((err) => {
      console.error(err);
      response.status(500).send('Internal Server Error');
  });
});

app.get('/api/myprofile', (req, res) => {
  if (req.cookies.userid !== undefined){
    res.redirect(`/profile/${req.cookies.userid}`)
  } else {
    res.redirect(`/api/auth/steam`)
  }
});

app.get('/api/current-user', (req, res) => {
  if (req.cookies.userid !== undefined){
    response.send(req.cookies.userid);
  } else {
    response.send(undefined);
  }
});

app.get('/api/findcookie/:id', (req, response) => {
  let playerId = req.params.id;
  pool.query(`select steamid from cookies where uuid="${playerId}"`)
  .then((res) => response.send(res))
  .catch((err) => console.error(err))
});

app.get('/api/steam-info/:id', async(req, res) => {
  const userId = req.params.id;
  var URL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAMKEY}&steamids=${userId}`;
  try {
    const logsApiResponse = await fetch(
      URL,
      FetchResultTypes.JSON
    );
    res.send(logsApiResponse);
  } catch (error) {
    res.send("steam error")
  }
});

app.get('/api/rgl-profile/:id', async(req, res) => {
  const userId = req.params.id;
  var URL = `https://api.rgl.gg/v0/profile/${userId}`;
  try {
    const logsApiResponse = await fetch(
      URL,
      FetchResultTypes.JSON
    );
    res.send(logsApiResponse);
  } catch (error) {
  }
})

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "/client/dist", "index.html"));
});

app.listen(port, function () {
  console.info(
    `Express server listening on port ${this.address().port} in ${
      app.settings.env
    } mode`
  );
});