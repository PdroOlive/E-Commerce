import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { UserTypes } from "../../types/types.js";
import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";


export const handleCreateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body as unknown as UserTypes;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const creatingUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER"
      },
    });

    const token = jwt.sign(
      { id: creatingUser.id, email: creatingUser.email, role: creatingUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] }
    );

    const {  password: _, ...userWithoutPassword } = creatingUser;
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: userWithoutPassword,
        token

      }
    });
  } catch (error) {
    next(error);
  }
}

export const handleLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as unknown as UserTypes;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] }
    );

    const {  password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      sucess: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
}