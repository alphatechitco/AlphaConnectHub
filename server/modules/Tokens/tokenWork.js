const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET


module.exports = {

   generateToken : (payload) => {
   return jwt.sign(payload, secretKey, { expiresIn: '1h' })
   }
   ,
   verifyToken : (token) => {
      return new Promise((resolve, reject) => {

      jwt.verify(token, secretKey, (err, decoded) => {
         if(err) {
            console.log("Error In Authentication")
            return reject(false);
            
         }
         console.log("Ok")
         return resolve(decoded);
      })
   
})
   }
}