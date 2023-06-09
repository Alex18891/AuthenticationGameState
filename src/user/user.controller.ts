import { Controller, Get, Post, Body, Param, Delete, Render, Put, Headers, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/forgotpwd-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangepwdUserDto } from './dto/changepwd-user.dto';
import { UpdateUserTokenDto } from './dto/changetoken-user.dto';
import { WishlistDto } from './dto/wishlist.dto';
import { UploadPictureDto } from './dto/uploadpicture-user.dto';
import { SendPushNotificationDto } from './dto/sendpushNotification.dto';

@Controller('users')
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
  updateUserPushToken(@Headers('authorization') authorizationHeader: string, @Param('id') id: string, @Body() updateUserTokenDto: UpdateUserTokenDto) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.updateUserPushToken(token, id, updateUserTokenDto)
    } else return { status: 401, message: "Missing Token" }
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
  searchUserByID(@Headers('authorization') authorizationHeader: string, @Param('id') id: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.searchUserByID(token, id)
    } else return { status: 401, message: "Missing Token" }
  }

  @Get(':id/wishlist')
  searchWishlistByID(@Headers('authorization') authorizationHeader: string, @Param('id') id: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.searchWishlistByID(token, id)
    } else return { status: 401, message: "Missing Token" }
  }

  @Post(':id/wishlist')
  addWishlistItem(@Headers('authorization') authorizationHeader: string, @Body() wishlistDto: WishlistDto, @Param('id') id: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.addWishlistItem(token, wishlistDto, id);
    } else return { status: 401, message: "Missing Token" }
  }

  @Get(':id/userwishlist')
  getWishlist(@Headers('authorization') authorizationHeader: string, @Param('id') id: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.getWishlist(token, id);
    } else return { status: 401, message: "Missing Token" }
  }

  @Delete(':id/wishlist/:gameId')
  deleteWishlistItem(@Headers('authorization') authorizationHeader: string, @Param('id') userId: string, @Param('gameId') gameId: number) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.removeWishlistItem(token, userId, gameId);
    } else return { status: 401, message: "Missing Token" }
  }

  @Get(':id/reviews')
  searchReviewsByUser(@Headers('authorization') authorizationHeader: string, @Param('id') id: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.searchReviewsByUser(token, id)
    } else return { status: 401, message: "Missing Token" }
  }

  @Get(':id/subscribedgames')
  searchSubscribedGames(@Headers('authorization') authorizationHeader: string, @Param('id') id: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.searchSubscribedGames(token, id);
    } else return { status: 401, message: "Missing Token" }
  }

  @Get(':username/topics')
  searchTopicsByUser(@Headers('authorization') authorizationHeader: string, @Param('username') username: string) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.searchTopicsByUser(token, username);
    } else return { status: 401, message: "Missing Token" }
  }

  @Post(':id/uploadprofilepicture')
  uploadImage(
    @Headers('authorization') authorizationHeader: string,
    @Param('id') id: string,
    @Body() image: { uri: string }) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      const uri = image.uri
      return this.userService.uploadImage(token, id, uri);
    } else return { status: 401, message: "Missing Token" }
  }

  @Post('/pushnotifications')
  sendPushNotification(@Headers('authorization') authorizationHeader: string, @Body() sendPushNotificationDto: SendPushNotificationDto) {
    if(authorizationHeader) 
    {
      const token = authorizationHeader.replace('Bearer ', '');
      return this.userService.sendPushNotification(token, sendPushNotificationDto);
    } else return { status: 401, message: "Missing Token" }
  }
}
