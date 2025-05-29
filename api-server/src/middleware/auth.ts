import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        email: string;
      };
    }
  }
}

interface JwtPayload {
  userId: number;
  username: string;
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    
    // Get user from database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ 
      where: { id: decoded.userId },
      select: ['id', 'username', 'email']
    });
    
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Attach user to request object with proper typing
    req.user = {
      userId: user.id,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    
    // Handle other types of errors
    if (error instanceof Error) {
      console.error('Authentication failed:', error.message);
    }
    
    res.status(500).json({ error: 'Authentication failed' });
  }
};
