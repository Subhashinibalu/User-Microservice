// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: any) {
    const mail = userData.email;
    try {
      const existingUser = await this.userModel.findOne({ email: mail }).exec();
      if (existingUser) {
        return { message: 'User already exists' };
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = new this.userModel({ ...userData, password: hashedPassword });
      await newUser.save();

      return { message: 'User registered successfully', user: newUser };
    } catch (error) {
      return { message: error.message };
    }
  }

  async userLogin(userData: any) {
    const mail = userData.email;

    try {
      const userDetail = await this.userModel.findOne({ email: mail }).exec();
      if (!userDetail) {
        return { message: 'User not found' };
      }

      const passwordMatch = await bcrypt.compare(userData.password, userDetail.password);
      if (!passwordMatch) {
        return { message: 'Invalid password' };
      }

      const token = jwt.sign({ _id: userDetail._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
      userDetail.token = token;
      await userDetail.save();
      return {
        message: 'Login successful',
        token,
        user: { username: userDetail.username, email: userDetail.email,userId:userDetail._id },
      };
    } catch (error) {
      console.error(error);
      return { message: 'An error occurred during login' };
    }
  }

  async findById(id: any) {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      throw new Error(error.message);
    }
  }
  

}
