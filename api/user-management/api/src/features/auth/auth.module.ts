import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'YOUR_SECRET_KEY', 
      signOptions: { expiresIn: '1h' },
    }),
    
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}