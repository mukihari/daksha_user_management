import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('address')
  createAddress( @Body() createAddressDto: CreateAddressDto) {
    return this.usersService.createAddress(createAddressDto);
  }

  @Get(':id/address')
  findAllAddress(@Param('id') id: string) {
    return this.usersService.findAllAddresses(id);
  }

  @Get(':id/address/:address_id')
  findOneAddress(@Param('address_id') addressId: string) {
    return this.usersService.findOneAddress(addressId);
  }

  @Patch('address/:address_id')
  updateAddress(
    @Param('address_id') addressId: string, 
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    return this.usersService.updateAddress(addressId, updateAddressDto);
  }

  @Delete('address/:address_id')
  removeAddress(@Param('address_id') addressId: string) {
    return this.usersService.removeAddress(addressId);
  }
  
}