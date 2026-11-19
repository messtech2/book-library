import express  from "express";
import type { Request, Response } from "express";
import { User } from "../models/user.js";
import   z  from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";
import { requireAuth } from "../middleware/requireAuth.js";


const router = express.Router();


const userSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['member', 'admin', 'librarian']).optional(),
  password: z.string().min(8).max(100),
});
const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});


router.post("/auth/register", async (req: Request, res: Response) => {
  
    try {
    const parsedBody = userSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: "Invalid request body", details: parsedBody.error });
    }

    const { firstName, lastName, email, password } = parsedBody.data;

        const userExists = await User.findOne({ email: parsedBody.data.email });
    if (userExists) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ firstName, lastName, email, passwordHash });
    await user.save();
    res.status(201).json(user);

} catch (error) {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
    return res.status(409).json({ error: 'User already exists' });
  }
  console.error("Error registering user:", error);
  res.status(500).json({ error: "Internal server error" });
}
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const parsedBody = userLoginSchema.safeParse(req.body);
    if(!parsedBody.success) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    const { email, password } = parsedBody.data;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.status(200).json(user);

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }

});

router.get("/auth/me", requireAuth, async (req: Request, res: Response) => {
 
  try {
    const user = await User.findById(res.locals.user.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.status(200).json(user);
 } catch (error) {
  console.error("Error loading current user:", error);
  res.status(500).json({ error: "Internal server error" });
}
});
router.post("/auth/logout", (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.status(204).json({ message: "Logged out successfully" });

});


export const authRoutes = router;