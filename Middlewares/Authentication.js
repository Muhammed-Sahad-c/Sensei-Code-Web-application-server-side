import jwt from "jsonwebtoken";
import {} from "dotenv/config";

export const userAuthentication = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) res.json({ status: false, message: `token expired` });
        else {
          req.body.id = decoded.id;
          next();
        }
      });
    } else {
      res.json({ status: false, message: `Please sign in` });
    }
  } catch (error) {
    res.json({ status: false, message: `Please sign in` });
  }
};

export const retriveUserSignUpDetails = (req, res, next) => {
  try {
    if (req.headers.token) {
      jwt.verify(req.headers.token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err)
          res.json({ status: false, message: `entered otp out of time` });
        else {
          req.body.userDetails = decoded;
          next();
        }
      });
    } else {
      res.json({ status: false, message: `token not found` });
    }
  } catch (error) {
    res.json({ status: false, message: `someting went wrong` });
    throw err;
  }
};
