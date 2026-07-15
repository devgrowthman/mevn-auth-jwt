// src\middleware\auth.middleware.js

import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log('check authorization status', authHeader, req.headers)

  if (!authHeader) {
    return res.status(401).json({
      message: 'Unathorized'
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    req.user = decoded
    next()

  } catch(error) {
    return res.status(401).json({
      message: 'Token expired'
    })
  }
}

export {
  authenticate
}