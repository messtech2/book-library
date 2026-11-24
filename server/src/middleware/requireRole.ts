import type { Request, Response, NextFunction } from 'express';



type Role = 'admin' | 'librarian' | 'member';

export const requireRole = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => { 

    const role = res.locals.user?.role;

    if (!role || !roles.includes(role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }           
    next();
  
  
};
