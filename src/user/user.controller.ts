import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { ChangepwdUserDto } from './dto/changepwd-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Res() res: Response, @Body() loginUserDto: LoginUserDto) {
    return this.userService.login(res, loginUserDto);
  }

  @Post('forgotpwd')
  forgotpwd(@Res() res: Response, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.forgotpwd(res, updateUserDto);
  }

  @Get('changepwd/:id/:token')
  changepwdrender(@Param('id') id: string, @Param('token') token: string, @Res() res: Response) {
    console.log(id)
    return this.userService.changepwdrender(id, token, res);
  }

  @Post('changepwd/:id/:token')
  changepwd(@Res() res: Response, @Param('id') id, @Param('token') token, @Body() changepwdUserDto: ChangepwdUserDto) {
    return this.userService.changepwd(res, id, token, changepwdUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
