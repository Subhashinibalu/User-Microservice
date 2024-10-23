// src/user/user.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'register' })
  async registerUser(@Payload() userData: any) {
    return await this.userService.createUser(userData);
  }

  @MessagePattern({ cmd: 'login' })
  async loginUser(@Payload() userData: any) {
    return await this.userService.userLogin(userData);
  }
  @MessagePattern({ cmd: 'findUser' })
  async getUser(@Payload() id: any) {
    return await this.userService.findById(id);
  }
}
