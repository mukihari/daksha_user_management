import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { endWith } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  goodBye(@Body() req:any): any {
    return req.name;
  }
}
