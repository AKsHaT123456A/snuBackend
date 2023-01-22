const jwt = require("jsonwebtoken");
const verify = (req, res, next) => {
  const token = req.header("auth-token");
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not a valid");
      req.user = user;
      req.token=token;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};
module.exports = verify;
