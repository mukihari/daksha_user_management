import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DB } from '../../db/db.module'; 
import { dept, user_dept } from '../../schema'; 
import { CreateDeptDto } from './dto/dept-dto';
import { UpdateDeptDto } from './dto/dept-dto';
import { AssignUserToDeptDto } from './dto/dept-dto';

@Injectable()
export class DeptService {
  constructor(@Inject(DB) private db: any) { }


  async create(createDeptDto: CreateDeptDto) {
    const [newDept] = await this.db
      .insert(dept)
      .values(createDeptDto)
      .returning();
    return newDept;
  }

  async findAll() {
    return await this.db.select().from(dept);
  }

  async findOne(id: string) {
    const [foundDept] = await this.db
      .select()
      .from(dept)
      .where(eq(dept.id, id));

    if (!foundDept) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return foundDept;
  }

  async update(id: string, updateDeptDto: UpdateDeptDto) {
    const [updatedDept] = await this.db
      .update(dept)
      .set({
        ...updateDeptDto,
        updatedAt: new Date(), 
      })
      .where(eq(dept.id, id))
      .returning();

    if (!updatedDept) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return updatedDept;
  }

  async remove(id: string) {
    const [deletedDept] = await this.db
      .delete(dept)
      .where(eq(dept.id, id))
      .returning();

    if (!deletedDept) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return deletedDept;
  }

 

  async assignUserToDept(assignDto: AssignUserToDeptDto) {

    await this.findOne(assignDto.dept_id);

    const [assignment] = await this.db
      .insert(user_dept)
      .values(assignDto)
      .returning();

    return assignment;
  }

  async findAllDeptAssignments(deptId: string) {
    
    return await this.db
      .select()
      .from(user_dept)
      .where(eq(user_dept.dept_id, deptId));
  }

 
  async findOneAssignment(id: string) {
    const [assignment] = await this.db
      .select()
      .from(user_dept)
      .where(eq(user_dept.id, id));

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  
  async removeUserFromDept(assignmentId: string) {
    const [deletedAssignment] = await this.db
      .delete(user_dept)
      .where(eq(user_dept.id, assignmentId))
      .returning();

    if (!deletedAssignment) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found`);
    }

    return deletedAssignment;
  }
}