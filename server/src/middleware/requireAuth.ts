import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { jwtSecret } from '../config.js';

export const requireAuth = (req:  Request, res:  Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {

    const payload = jwt.verify(token, jwtSecret) as JwtPayload;

    res.locals.user = { id: payload.sub, role: payload.role };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
