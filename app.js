require('app-module-path').addPath(__dirname);

const SessionStore = require('express-mysql-session');
const express = require('express');
const session = require('express-session');
const parser = require('body-parser');
const moment = require('moment');
const admyn = require('admyn/server');
const app = express();

const config = require('./config');

app.listen(config.environment.port, () =>
  console.log('~~Server running on port', config.environment.port)
);

/* Sessions */
app.use(
  session({
    secret: config.keys.session,
    store: new SessionStore({
      host: config.database.mysql.host,
      port: config.database.mysql.port,
      user: config.database.mysql.user,
      password: config.database.mysql.password,
      database: config.database.mysql.database,
      useConnectionPooling: true
    }),
    saveUninitialized: true,
    resave: true,
    cookie: {
      httpOnly: false
    }
  })
);

/* Body Parser */
app.use(parser.json({ limit: '26mb' }));
app.use(parser.urlencoded({ extended: true, limit: '26mb' }));

/* Admyn */
app.use(
  '/admyn-yCPnUcXcU10QRkwv',
  function(req, res, next) {
    if (!req.session.admin) return res.status(403).send();
    req.admyn = { database: config.database.mysql };
    next();
  },
  admyn()
);

// Express middleware / controllers
app.use('/static', express.static(__dirname + '/static'));
app.get('/panel', (req, res) =>
  res.sendFile(__dirname + '/views/panel.html')
);
app.get('/admin', (req, res) =>
  res.sendFile(__dirname + '/views/admin.html')
);
app.get('/app', (req, res) =>
  res.sendFile(__dirname + '/views/app.html')
);
app.use('/api', require('./controllers/'));
app.get('/*', (req, res) => {
  if (config.environment.type == 'dev') {
    req.session.uid = 1,
    req.session.subscription = moment().add(7, 'days').unix() * 1000;
  }

  res.sendFile(__dirname + '/views/info.html');
});

if (config.environment.runCronJobs) require('jobs/cron/start')();