import { BadRequestException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/forgotpwd-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChangepwdUserDto } from './dto/changepwd-user.dto';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>, private configService: ConfigService) { }
  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    const email = createUserDto.email;
    const passwordEncrypt = await bcrypt.hash(password, 10);
    const username = createUserDto.username;
    const usernameprevious = await this.UserModel.findOne({ username });
    const emailprevious = await this.UserModel.findOne({ email });
    if (!usernameprevious && !emailprevious) {
      createUserDto.password = passwordEncrypt;
      const user = new this.UserModel(createUserDto);
      user.save();
      return {status:200, message: "User Created"};
    }
    else{
      return {status:203, message: "Username or email already exists" };
    }
   
  }

  async login(loginUserDto: LoginUserDto) {
    const password = loginUserDto.password;
    const username = loginUserDto.username;
    const userdb = await this.UserModel.findOne({ username });

    if (!userdb) {
      return { status: 203, message: "User not found" };
    }

    const passwordvalid = await bcrypt.compare(password, userdb.password);

    if (passwordvalid) {
      return { status: 200, message: "User logged in" }
    } else {
      return { status: 400, message: "Wrong password" }
    }
  }

  async forgotPassword(updateUserDto: UpdateUserDto) {
    const email = updateUserDto.email

    const sendResetPasswordMail = async (email, link) => {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'noreplyloginapp18881@gmail.com',//email responsible to send the email
            pass: this.configService.get<string>('NODEMAILER_PASSWORD')//password of that email
          }
        });
        const mailOptions = {
          from: 'noreplyloginapp18881@gmail.com',
          to: email,//email that is defined to the user input 
          subject: 'Forgot Password',
          //html: You just received a mail!
          html: '<p> Link to reset your password: <br/><br/> <a href="' + link + '">' + link + '</a>'
        }
        transporter.sendMail(mailOptions)
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    try {
      const user = await this.UserModel.findOne({ email }); //see if the email is in the mongodatabase
      if (!user) {
        throw new NotFoundException('User not found');
      }
      else {
        const token = await jwt.sign(
          {
            id: user._id,
            email: user.email
          },
          this.configService.get<string>('JWT_SECRET'),
          {
            expiresIn: '10m'
          });
        const link = `http://localhost:3000/user/changepwd/${user._id}/${token}`;
        sendResetPasswordMail(email, link);
        return {status: 200, message: 'Now you can verify your email'};
      }
    } catch (error) {
      return error
    }
  }

  async changePasswordRender(@Param('id') id, @Param('token') token) {
    const userData = await this.UserModel.findOne({ _id: id }); //see if the id was created

    if (!userData) {
      return { token: token, status: 203, message: "User not found" };
    }

    try {
      jwt.verify(token, this.configService.get<string>('JWT_SECRET')); // verify token
      return { token: token, status:200, message: "Verified" };
    } catch (error) {
      return { token: token,status:400, message: "Something went wrong" };
    }
  }

  async changePassword(changepwdUserDto: ChangepwdUserDto) {
    const password = changepwdUserDto.password;
    const token = changepwdUserDto.token;

    try {
      const user = jwt.verify(token, this.configService.get<string>('JWT_SECRET')); // verify a token symmetric
      const userData = await this.UserModel.findOne({ _id: user.id });
      if (!userData) {
        return { status: 203, message: "User not found" };
      }
      const encryptedPassword = await bcrypt.hash(password, 10);//encrypt the password
      await this.UserModel.updateOne(
        { _id: user.id },
        { $set: { "password": encryptedPassword } }
      )
      return { status:200 };
    } catch (error) {
      return { status:400, message: "Something went wrong"};
    }
  }
}
