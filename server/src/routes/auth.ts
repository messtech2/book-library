import express  from "express";
import type { Request, Response } from "express";
import { User } from "../models/user.js";
import   z  from "zod";
import bcrypt from "bcryptjs";


const router = express.Router();

const userSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['member', 'admin', 'librarian']).optional(),
  password: z.string().min(8).max(100),
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



export const authRoutes = router;