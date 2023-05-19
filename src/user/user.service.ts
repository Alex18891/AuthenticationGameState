import { Injectable, NotAcceptableException, Param, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { ChangepwdUserDto } from './dto/changepwd-user.dto';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

// JWT_SECRET
const JWT_SECRET = 'dASlkfjkdhbfsdhfilahfliahflhaflhewlifhaehfuaewhlai';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) { }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = createUserDto.password;
    const passwordEncrypt = await bcrypt.hash(password, 10);
    createUserDto.password = passwordEncrypt;
    const createdUser = new this.UserModel(createUserDto);
    return createdUser.save();
  }

  async login(@Res() res: Response, loginUserDto: LoginUserDto) {
    const password = loginUserDto.password;
    const username = loginUserDto.username;
    const userdb = await this.UserModel.findOne({ username });
    const passwordvalid = await bcrypt.compare(password, userdb.password);
    if (!userdb) {
      throw new NotAcceptableException('could not find the user');
    }
    if (userdb && passwordvalid) {
      res.status(400).json({ username })
    }
  }

  async forgotpwd(@Res() res: Response, updateUserDto: UpdateUserDto) {
    const email = updateUserDto.email

    const sendResetPasswordMail = async (email, link) => {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'noreplyloginapp18881@gmail.com',//email responsible to send the email
            pass: 'kppunrkqttoonjjh'//password of that email
          }
        });
        const mailOptions = {
          from: 'noreplyloginapp18881@gmail.com',
          to: email,//email that is defined to the user input 
          subject: 'For Reset Password',
          //html: You just received a mail!
          html: '<p> Hi,Please enter the link and reset your password: <br/> <a href="' + link + '">' + link + '</a>'
        }
        transporter.sendMail(mailOptions, function (error, infor) {
          if (error) {
            console.log(error);
          }
          else {
            console.log("Mail has been sent- ", infor.response);
          }
        });
      } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
      }
    }

    try {
      const user = await this.UserModel.findOne({ email });//see if the email is in the mongodatabase
      console.log(user)
      if (!user) {
        return res.send("User not found");
      }
      else {
        const token = await jwt.sign(
          {
            id: user._id,
            email: user.email
          },
          JWT_SECRET,
          {
            expiresIn: '5m'
          });
        console.log(token);
        const link = `http://localhost:3000/user/changepwd/${user._id}/${token}`;
        sendResetPasswordMail(email, link);
        console.log(link);
        res.send("Now you can verify your email");
      }
    } catch (error) {
      return error
    }

  }

  async changepwd(@Res() res: Response, @Param('id') id, @Param('token') token, changepwdUserDto: ChangepwdUserDto) {
    const password = changepwdUserDto.password;
    const userData = await this.UserModel.findOne({ _id: id });
    if (!userData) {
      res.render("index", { status: "User not found" });
    }
    else {
      try {
        const verify = jwt.verify(token, JWT_SECRET);// verify a token symmetric
        const encryptedPassword = await bcrypt.hash(password, 10);//encrypt the password
        await this.UserModel.updateOne( //Update user by id, setting the new passoword
          {
            _id: id,
          },
          {
            $set: {
              password: encryptedPassword
            },
          }
        );
        res.render("index", { email: verify.email, status: "verified" });
      } catch (error) {
        res.render("index", { status: "Something went wrong" });
      }
    }
  }

  async changepwdrender(@Param('id') id, @Param('token') token, @Res() res: Response) {
    console.log('ola' + id)
    const userData = await this.UserModel.findOne({ _id: id });//see if the id was created
    console.log(userData);
    if (!userData) {
      res.render("index", { status: "User not found" });
    }
    const verify = jwt.verify(token, JWT_SECRET);// verify a token symmetric
    try {
      res.render("index", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      res.render("index", { email: verify.email, status: "Something went wrong" });
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
