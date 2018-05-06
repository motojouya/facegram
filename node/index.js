'use strict';

const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer  = require('multer');

const randomPassword = (len) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charLen = chars.length;
  let password = '';
  for(let i = 0; i < len; i++){
    password += chars[Math.floor(Math.random() * charLen)];
  }
  return password;
};

const getFileName = () => {
  if (face_number == 9) {
    face_number = 0;
  } else {
    face_number++;
  }
  return './files/face' + face_number + '.jpeg';
};

const PAUSE_IMG = './files/pause.jpg';
const API_VERSION = 1;

const port = process.env.PORT || 3000;
const interval = process.env.INTERVAL || 10000;
const secret = process.env.SESSION_SECRET;
const contributerPassword = process.env.CONTRIBUTER_PASSWORD;
if (!secret || !contributerPassword) {
  console.log('Need session secret and contributer password.');
  return;
}

const upload = multer({dest: 'temp/'});
const app = express();

let image_file = PAUSE_IMG;
let audiencePassword;
let face_number;

process.on('uncaughtException', (err) => {
  console.log('Top level error. you can not recover.', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(express.static('public'));

app.use('/api/v' + API_VERSION, (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use(session({
  saveUninitialized: false,
  secret: secret,
  resave: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
  },
}));

app.post('/api/v' + API_VERSION + '/auth', (req, res) => {

  if (!audiencePassword) {
    return res.json({auth: false});
  }
  if (req.session.auth !== 'audience' && audiencePassword !== req.body.password) {
    return res.json({auth: false});
  }
  req.session.auth = 'audience';
  return res.json({
    auth: true,
    interval: interval,
  });
});

app.post('/api/v' + API_VERSION + '/contributer/auth', (req, res) => {

  if (req.session.auth !== 'contributer' && contributerPassword !== req.body.password) {
    return res.json({auth: false});
  }
  req.session.auth = 'contributer';
  audiencePassword = randomPassword(8);
  return res.json({
    auth: true,
    interval: interval,
    audience_password: audiencePassword,
  });

});

app.get('/api/v' + API_VERSION + '/face', (req, res) => {

  if (!req.session.auth) {
    return res.json({auth: false});
  }
  fs.readFile(image_file, (err, file) => {
    res.removeHeader('X-Powered-By');
    res.removeHeader('ETag');
    res.header('Cache-Control', ['private', 'no-store', 'no-cache', 'must-revalidate', 'proxy-revalidate'].join(','));
    res.header('Expires', '0');
    res.header('no-cache', 'Set-Cookie');
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(file);
  });
});

app.post('/api/v' + API_VERSION + '/face', upload.single('face_image'), (req, res) => {

  if (req.session.auth !== 'contributer') {
    return res.json({auth: false});
  }
  const upload_file = req.file.path;
  const temp_name = getFileName();

  fs.rename(upload_file, temp_name, (err) => {
    image_file = temp_name;

    fs.unlink(upload_file, () => {
      res.json({
        auth: true,
        upload: true,
      });
    });
  });
});

app.post('/api/v' + API_VERSION + '/pause', (req, res) => {

  if (req.session.auth !== 'contributer') {
    return res.json({auth: false});
  }
  image_file = PAUSE_IMG;
  res.json({
    auth: true,
    pause: true,
  });
});

app.use((req, res) => {
  res.status(404);
  res.json({message: 'Not Found'});
});

app.use((err, req, res, next) => {
  res.status(500);
  res.json({message: 'Server Error'});
});

const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Server start. http://%s:%s', host, port);
});

