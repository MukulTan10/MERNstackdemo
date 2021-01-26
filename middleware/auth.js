const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //next is callback we have to run so move to next piece of middleware

  //Get token request from token
  const token = req.header("x-auth-token");

  //check if not Token
  if (!token) {
    //401 for unauthorized
    return res.status(401).json({ msg: "No Token,authorization denied" });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user; //assign value/adding to req object and user parameter
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token Not Valid" });
  }
};
