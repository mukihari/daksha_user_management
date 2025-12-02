import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { DB } from '../../db/db.module'; 
import { user } from '../../schema';      
import { LoginDto } from './dto/aut-dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB) private db: any,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const [foundUser] = await this.db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, foundUser.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }


    let redirectUrl = '/dashboard'; 
    
    if (foundUser.role === 'admin') {
      redirectUrl = '/admin';
    } else {
      
      redirectUrl = '/users';
    }

    
    const payload = { 
      sub: foundUser.id, 
      email: foundUser.email, 
      role: foundUser.role 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      redirect_url: redirectUrl, 
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      }
    };
  }
}