const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const { auth } = require('express-openid-connect');
const { copyFileSync } = require('fs');
const Bundler = require('parcel-bundler');
const Database = require("@replit/database");
const app = express();
const db = new Database();

//auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://auth0-gate.linothecreator.repl.co',
  clientID: 'xXJ2NyT8een7EK0iouaSrrW018v35eHr',
  issuerBaseURL: 'https://dev-huzxpx5ujipk53om.us.auth0.com'
};

//parcel bundler
const file = "./upload.html"; 
const options ={};
let bundler = new Bundler(file, options);

//express.js middleware
app.use(express.json());
app.use("/dist", express.static('./dist'));
app.use("/src", express.static('./src'));
app.use(bodyParser.urlencoded({ extended: true }));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.use(bundler.middleware());
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

app.get('/home', (req, res) => {
  let userData = {
  id: req.oidc.user.sub,
  name: req.oidc.user.name,
  email: req.oidc.user.email
}
    
db.set("id", userData); 
res.sendFile(__dirname + "/index.html");});

app.get('/logout', (req, res) => {
  auth.logout({
    returnTo: 'https://Auth0-gate.linothecreator.repl.co',
    clientID: 'xXJ2NyT8een7EK0iouaSrrW018v35eHr'
  });
});

app.get('/upload', (req, res)=> {
  
})

app.listen(3000, () => {
  console.log('server started');
});

