import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId; // Get user ID from auth middleware
      
      // Find the user to be deleted
      const user = await this.userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Delete the user
      await this.userRepository.remove(user);
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting user:', error.message);
      } else {
        console.error('An unknown error occurred while deleting user');
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // User ID is set by the auth middleware
      const userId = (req as any).user.userId;
      const user = await this.userRepository.findOne({ 
        where: { id: userId },
        select: ['id', 'username', 'email', 'createdAt'] 
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Profile error:', error.message);
      } else {
        console.error('An unknown error occurred while fetching profile');
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
