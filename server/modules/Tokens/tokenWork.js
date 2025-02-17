const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET


module.exports = {

   generateToken : (payload) => {
   return jwt.sign(payload, secretKey, { expiresIn: '1h' });
   
   }
   ,
   verifyTokenMiddleware : (req, res, next) => {
      console.log("Protected Prompted...");
      console.log("cookies, ", req.cookies);
      const token = req.cookies.token;
  
      if (!token) {
          return res.status(401).json({ error: "Unauthorized" });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
              return res.status(403).json({ error: "Invalid token" });
          }
  
          req.user = decoded.user_id;
          next();
      });
  }
}
