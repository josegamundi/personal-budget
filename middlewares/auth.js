import express from 'express';
import jwt from "jsonwebtoken";

export const tokenAuth = async (req, res, next) => {
  let token = req.get('Authorization');
  if (!token) return res.status(401).json({ "message": "Invalid token, access denied" });
  token = token.split(' ')[1];
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch(error) {
    res.status(401).json({ "message": error.message })
  }
}