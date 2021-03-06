require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const noteRouter = require('./noteful-router/note-router');
const folderRouter = require('./noteful-router/folder-router');

const app = express();

const morgainOption = NODE_ENV === 'production' ? 'tiny' : 'dev';

app.use(morgan(morgainOption));
app.use(helmet());
app.use(cors());

app.use('/api/noteful/notes', noteRouter);
app.use('/api/noteful/folders', folderRouter);


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;