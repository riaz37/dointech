import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../database/schemas/task.schema';
import { User, UserDocument } from '../database/schemas/user.schema';
import { CreateTaskDto } from '../shared/dto/create-task.dto';
import { UpdateTaskDto } from '../shared/dto/update-task.dto';
import { ITaskResponse, ITaskFilters, TaskStatus } from '../shared/interfaces/task.interface';
import { IUserResponse } from '../shared/interfaces/user.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, createdBy: string): Promise<ITaskResponse> {
    // Validate assigned user exists
    const assignedUser = await this.userModel.findById(createTaskDto.assignedUser);
    if (!assignedUser) {
      throw new NotFoundException('Assigned user not found');
    }

    const task = new this.taskModel({
      ...createTaskDto,
      dueDate: new Date(createTaskDto.dueDate),
      createdBy,
    });

    const savedTask = await task.save();
    return this.populateAndTransform(savedTask);
  }

  async findAll(filters: ITaskFilters = {}): Promise<ITaskResponse[]> {
    const query: any = {};

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.assignedUser) {
      query.assignedUser = filters.assignedUser;
    }

    if (filters.dueDate) {
      query.dueDate = {};
      if (filters.dueDate.from) {
        query.dueDate.$gte = new Date(filters.dueDate.from);
      }
      if (filters.dueDate.to) {
        query.dueDate.$lte = new Date(filters.dueDate.to);
      }
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const tasks = await this.taskModel
      .find(query)
      .populate('assignedUser', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .sort({ createdAt: -1 });

    return tasks.map(task => this.transformTaskResponse(task));
  }

  async findOne(id: string, userId: string): Promise<ITaskResponse> {
    const task = await this.taskModel
      .findOne({ _id: id, assignedUser: userId })
      .populate('assignedUser', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.transformTaskResponse(task);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<ITaskResponse> {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user has permission to update (creator or assigned user)
    if (task.createdBy.toString() !== userId && task.assignedUser.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    // Validate assigned user if being updated
    if (updateTaskDto.assignedUser) {
      const assignedUser = await this.userModel.findById(updateTaskDto.assignedUser);
      if (!assignedUser) {
        throw new NotFoundException('Assigned user not found');
      }
    }

    const updateData: any = { ...updateTaskDto };
    if (updateTaskDto.dueDate) {
      updateData.dueDate = new Date(updateTaskDto.dueDate);
    }

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('assignedUser', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName');

    return this.transformTaskResponse(updatedTask);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user has permission to delete (only creator)
    if (task.createdBy.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }

    await this.taskModel.findByIdAndDelete(id);
  }

  async getTaskStats(userId?: string): Promise<any> {
    const matchQuery = userId ? { assignedUser: userId } : {};

    const stats = await this.taskModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      [TaskStatus.PENDING]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.COMPLETED]: 0,
      total: 0,
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    return result;
  }

  private async populateAndTransform(task: TaskDocument): Promise<ITaskResponse> {
    await task.populate('assignedUser', 'username firstName lastName');
    await task.populate('createdBy', 'username firstName lastName');
    
    return this.transformTaskResponse(task);
  }

  private transformTaskResponse(task: any): ITaskResponse {
    return {
      _id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      assignedUser: {
        _id: task.assignedUser._id.toString(),
        username: task.assignedUser.username,
        firstName: task.assignedUser.firstName,
        lastName: task.assignedUser.lastName,
      },
      dueDate: task.dueDate,
      createdBy: {
        _id: task.createdBy._id.toString(),
        username: task.createdBy.username,
        firstName: task.createdBy.firstName,
        lastName: task.createdBy.lastName,
      },
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
