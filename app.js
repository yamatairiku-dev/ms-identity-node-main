/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config()

// const path = require('path')
const express = require('express')
const session = require('express-session')
const expressEjsLayouts = require('express-ejs-layouts')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

// initialize express
const app = express()
const port = process.env.PORT || 3000
/**
 * Using express-session middleware for persistent user session. Be sure to
 * familiarize yourself with available options. Visit: https://www.npmjs.com/package/express-session
 */
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  name: 'msal.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // sameSite: 'lax',
    secure: false // set this to true on production
  }
}))

// view engine setup
app.set('view engine', 'ejs')
app.use(expressEjsLayouts)

app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(port, () => console.log(`MSAL App listening on port ${port}!`))
