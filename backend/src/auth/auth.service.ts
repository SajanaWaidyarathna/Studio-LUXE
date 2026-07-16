import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 1. Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 3. Create the user
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    // 1. Find the user
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Verify the password
    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // --- SMART ROLE CHECK ---
    const isAdminEmail = user.email === 'admin@luxestudio.com'; 
    
    // FIXED: If the database says ADMIN, *or* they are using the master email, make them ADMIN.
    const userRole = (user.role === 'ADMIN' || isAdminEmail) ? 'ADMIN' : 'USER';

    // 3. Generate the JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: userRole, 
    };

    const token = this.jwtService.sign(payload);

    // 4. Return token AND user data so the frontend knows who logged in
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role: userRole,
      }
    };
  }
}