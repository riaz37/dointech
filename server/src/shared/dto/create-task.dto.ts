import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../interfaces/task.interface';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project documentation' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Write comprehensive documentation for the task management system' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  assignedUser: string;

  @ApiProperty({ example: '2024-12-31T23:59:59.000Z' })
  @IsDateString()
  dueDate: string;
}
