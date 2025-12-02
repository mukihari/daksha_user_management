import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/dept-dto';
import { UpdateDeptDto } from './dto/dept-dto';
import { AssignUserToDeptDto } from './dto/dept-dto';

@Controller('dept')
export class DeptController {
  constructor(private readonly departmentsService: DeptService) {}


  @Post()
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.departmentsService.create(createDeptDto);
  }

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeptDto: UpdateDeptDto) {
    return this.departmentsService.update(id, updateDeptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }

  
  @Post('assign')
  assignUser(@Body() assignDto: AssignUserToDeptDto) {
    return this.departmentsService.assignUserToDept(assignDto);
  }

 
  @Get(':id/users')
  getDepartmentUsers(@Param('id') deptId: string) {
    return this.departmentsService.findAllDeptAssignments(deptId);
  }

  
  @Get('assignments/:assignment_id')
  getAssignment(@Param('assignment_id') id: string) {
    return this.departmentsService.findOneAssignment(id);
  }

  
  @Delete('assignments/:assignment_id')
  removeUserFromDept(@Param('assignment_id') id: string) {
    return this.departmentsService.removeUserFromDept(id);
  }
}