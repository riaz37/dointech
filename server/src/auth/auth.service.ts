import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../database/schemas/user.schema';
import { CreateUserDto } from '../shared/dto/create-user.dto';
import { IUserResponse, ILoginResponse } from '../shared/interfaces/user.interface';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const { email, username, password, firstName, lastName } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new this.userModel({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const savedUser = await user.save();
    
    return this.transformUserResponse(savedUser);
  }

  async validateUser(username: string, password: string): Promise<IUserResponse | null> {
    const user = await this.userModel.findOne({ username });
    
    if (user && await bcrypt.compare(password, user.password)) {
      return this.transformUserResponse(user);
    }
    
    return null;
  }

  async login(user: IUserResponse): Promise<ILoginResponse> {
    const payload: JwtPayload = {
      sub: user._id,
      username: user.username,
      email: user.email,
    };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async findById(id: string): Promise<IUserResponse | null> {
    const user = await this.userModel.findById(id);
    return user ? this.transformUserResponse(user) : null;
  }

  async findAll(): Promise<IUserResponse[]> {
    const users = await this.userModel.find();
    return users.map(user => this.transformUserResponse(user));
  }

  private transformUserResponse(user: UserDocument): IUserResponse {
    return {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    };
  }
}
