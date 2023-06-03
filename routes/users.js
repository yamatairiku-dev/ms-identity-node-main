/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express')
const router = express.Router()

const fetch = require('../fetch')

const { GRAPH_ME_ENDPOINT } = require('../authConfig')

// custom middleware to check auth state
function isAuthenticated (req, res, next) {
  console.log(`\nSession ID: ${req.session.id}\n`)
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/signin') // redirect to sign-in route
  }

  next()
}

router.get('/id',
  isAuthenticated, // check if user is authenticated
  async (req, res, next) => {
    const idTokenClaims = req.session.account.idTokenClaims
    console.log(idTokenClaims)
    res.render('id', { idTokenClaims })
  }
)

router.get('/profile',
  isAuthenticated, // check if user is authenticated
  async (req, res, next) => {
    try {
      const graphResponse = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken)
      console.log(graphResponse)
      res.render('profile', { profile: graphResponse })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
