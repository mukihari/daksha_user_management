import { PartialType } from '@nestjs/mapped-types';

export class CreateDeptDto {
  name: string;
}

export class UpdateDeptDto extends PartialType(CreateDeptDto) {}


export class AssignUserToDeptDto {
  user_id: string;
  dept_id: string;
}