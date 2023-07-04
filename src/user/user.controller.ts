import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/forgotpwd-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangepwdUserDto } from './dto/changepwd-user.dto';
import { UpdateUserTokenDto } from './dto/changetoken-user.dto';
import { WishlistDto } from './dto/wishlist.dto';

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

  @Put(':id')
  updateUserPushToken(@Param('id') id: string, @Body() updateUserTokenDto: UpdateUserTokenDto) {
    return this.userService.updateUserPushToken(id, updateUserTokenDto)
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

  @Get(':id')
  searchUserByID(@Param('id') id: string) {
    return this.userService.searchUserByID(id);
  }

  @Post(':id/wishlist')
  addWishlistItem(@Body() wishlistDto: WishlistDto, @Param('id') id: string) {
    return this.userService.addWishlistItem(wishlistDto, id);
  }

  @Delete(':id/wishlist/:gameID')
  deleteWishlistItem(@Param('id') userID: string, @Param('gameID') gameID: number) {
    return this.userService.removeWishlistItem(userID, gameID);
  }
}
