import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../interfaces/task.interface';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Complete project documentation' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Write comprehensive documentation for the task management system' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsOptional()
  assignedUser?: string;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59.000Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
