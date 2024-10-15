import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt'; 
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UsersService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new HttpException('Email or password is incorrect', 401);
    }

    console.log(user);

    // const isPasswordMatch = await this.userService.comparePassword(
    //     password,
    //     user.password
    // );
    console.log(password, user.password);
    const decrypt = await bcrypt.compare(password, user.password);
    console.log(decrypt);
    // if (!isPasswordMatch) {
    //   throw new HttpException('Email or password is incorrect', 401);
    // }

    user.password = undefined;

    return user;
  }

  async signUp(signInDto: CreateUserDto) {
    const encryptedPassword = await bcrypt.hash(signInDto.password, 4);
    const isCrypt = await bcrypt.compare(signInDto.password, encryptedPassword);
    console.log(isCrypt); 
    return this.userService.create(signInDto);
  }
}
