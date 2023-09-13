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

const port = process.env.PORT || 3000;

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
 returnURL: 'http://localhost:5173/api/auth/steam/return',
 realm: 'http://localhost:5173',
 apiKey: `${process.env.STEAMKEY || "18D6B8C4F205B3A1BD6608A68EC83C3F"}`
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

app.get('/api/myprofile', (req, res) => {
  if (req.cookies.userid !== undefined){
    res.redirect(`/profile/${req.cookies.userid}`)
  } else {
    res.redirect(`/api/auth/steam`)
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
  var URL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAMKEY || "18D6B8C4F205B3A1BD6608A68EC83C3F"}&steamids=${userId}`;

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