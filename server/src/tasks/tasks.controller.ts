import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../shared/dto/create-task.dto';
import { UpdateTaskDto } from '../shared/dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ITaskResponse, TaskStatus } from '../shared/interfaces/task.interface';
import { IUserResponse } from '../shared/interfaces/user.interface';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 404, description: 'Assigned user not found' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: Partial<IUserResponse>,
  ): Promise<ITaskResponse> {
    return this.tasksService.create(createTaskDto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks for the current user with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'assignedUser', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'dueDateFrom', required: false, type: String })
  @ApiQuery({ name: 'dueDateTo', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async findAll(
    @CurrentUser() user: Partial<IUserResponse>,
    @Query('status') status?: TaskStatus,
    @Query('assignedUser') assignedUser?: string,
    @Query('search') search?: string,
    @Query('dueDateFrom') dueDateFrom?: string,
    @Query('dueDateTo') dueDateTo?: string,
  ): Promise<ITaskResponse[]> {
    const filters: any = {
      // Only show tasks assigned to the current user
      assignedUser: user._id,
    };

    if (status) filters.status = status;
    if (search) filters.search = search;
    if (dueDateFrom || dueDateTo) {
      filters.dueDate = {};
      if (dueDateFrom) filters.dueDate.from = new Date(dueDateFrom);
      if (dueDateTo) filters.dueDate.to = new Date(dueDateTo);
    }

    return this.tasksService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get task statistics for the current user' })
  @ApiResponse({ status: 200, description: 'Task statistics retrieved successfully' })
  async getStats(@CurrentUser() user: Partial<IUserResponse>) {
    return this.tasksService.getTaskStats(user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: Partial<IUserResponse>,
  ): Promise<ITaskResponse> {
    return this.tasksService.findOne(id, user._id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: Partial<IUserResponse>,
  ): Promise<ITaskResponse> {
    return this.tasksService.update(id, updateTaskDto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: Partial<IUserResponse>,
  ): Promise<{ message: string }> {
    await this.tasksService.remove(id, user._id);
    return { message: 'Task deleted successfully' };
  }
}
