import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // ✅ READ TOKEN FROM COOKIE
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};

export default auth;
