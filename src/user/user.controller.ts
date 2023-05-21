import { Controller, Get, Post, Body, Patch, Param, Delete, Render } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/forgotpwd-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangepwdUserDto } from './dto/changepwd-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('forgotpwd')
  forgotPassword(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.forgotPassword(updateUserDto);
  }

  @Get('changepwd/:id/:token')
  @Render('index')
  changePasswordRender(@Param('id') id: string, @Param('token') token: string) {
    return this.userService.changePasswordRender(id, token);
  }

  @Post('changepwd')
  changePassword(@Body() changepwdUserDto: ChangepwdUserDto) {
    return this.userService.changePassword(changepwdUserDto);
  }
}
