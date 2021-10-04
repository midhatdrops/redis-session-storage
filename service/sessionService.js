const redisConnector = require('../util/connection').get();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const sessionService = {
      validate: {},
      createSession: (req,res) => {
        if(req.body[constants.app.headerKey]) {
          redisConnector.exists(req.body[constants.app.headerKey], (err,reply) => {
            if(err) res.status(500).body("Error while connecting into redis").end();
            if( reply == 1) {
              return res.status(400).body("Session already created").end();
            }
          })
        }
        const hash = bcrypt.hash(req.body[client.document],10, (err,hash) => {
          if(err) {
            return res.status(500).body("Error while hashing").end();
          } else {
            console.log("Generated new hash:" + hash);
            return hash
          }
        })
        const sessionData = req.body[client.infos]
        const sessionCreate = redisConnector.set(hash,sessionData, (err,reply) => {
          if(err) return res.status(500).end();
          if(reply == 1) return true
        });
        if(sessionCreate) {
          const jwt = jwt.sign({hash: hash},process.env.SECRET_SIGN,{
          expiresIn: '1h'
        });
        return res.status(201).body({DateTime: `${Date.now()}`, redisJWT: jwt}).end();
        }
      }
}