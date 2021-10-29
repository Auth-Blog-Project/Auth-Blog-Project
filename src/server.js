'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
const morgan = require('morgan');

const notFoundHandler = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
const logger = require('./middleware/logger');
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const articleRoutes = require('./routes/articles');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

//routes
app.use('/pages', pageRoutes);
app.use('/pages', articleRoutes);
app.use(authRoutes);

// Catch-alls
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
