import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './features/user/user.module';
import { DeptModule } from './features/dept/dept.module';
import { AuthModule } from './features/auth/auth.module';


@Module({
  imports: [DbModule, UsersModule, DeptModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
