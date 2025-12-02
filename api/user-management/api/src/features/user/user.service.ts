import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB } from '../../db/db.module';
import { user, address } from '../../schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto'; // 
import { UpdateAddressDto } from './dto/update-address.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject(DB) private db: any) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [newUser] = await this.db
      .insert(user)
      .values({
        ...userData,
        password_hash: hashedPassword, 
      })
      .returning();


    delete newUser.password_hash;

    return newUser;
  }


  async findAll() {
    return await this.db.select().from(user);  
  }

  async findOne(id: string) {
    const [foundUser] = await this.db
      .select()
      .from(user)  
      .where(eq(user.id, id));  

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
  
    const { password, ...userData } = updateUserDto;
    
    const valuesToUpdate: any = { ...userData };

    if (password) {
      const saltRounds = 10;
      valuesToUpdate.password_hash = await bcrypt.hash(password, saltRounds);
    }

  
    const [updatedUser] = await this.db
      .update(user)
      .set(valuesToUpdate)
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    delete updatedUser.password_hash;

    return updatedUser;
  }

  async remove(id: string) {
    const [deletedUser] = await this.db
      .delete(user)  
      .where(eq(user.id, id)) 
      .returning();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return deletedUser;
  }


  async createAddress(createAddressDto: CreateAddressDto) {

    await this.findOne(createAddressDto.user_id);

    const [newAddress] = await this.db
      .insert(address)
      .values({
        ...createAddressDto,
      })
      .returning();

    return newAddress;
  }

  async findAllAddresses(userId: string) {
    return await this.db
      .select()
      .from(address)
      .where(eq(address.user_id, userId));
  }

  async findOneAddress(addressId: string) {
    const [foundAddress] = await this.db
      .select()
      .from(address)
      .where(eq(address.id, addressId));

    if (!foundAddress) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    return foundAddress;
  }

  async updateAddress(addressId: string, updateAddressDto: UpdateAddressDto) {
    const [updatedAddress] = await this.db
      .update(address)
      .set(updateAddressDto)
      .where(eq(address.id, addressId))
      .returning();

    if (!updatedAddress) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    return updatedAddress;
  }

  async removeAddress(addressId: string) {
    const [deletedAddress] = await this.db
      .delete(address)
      .where(eq(address.id, addressId))
      .returning();

    if (!deletedAddress) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    return deletedAddress;
  }

}