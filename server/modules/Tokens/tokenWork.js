const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'DefaultSecretKey'


module.exports = {

   generateToken : (payload) => {
   return jwt.sign(payload, secretKey, { expiresIn: '1h' })
   }

}