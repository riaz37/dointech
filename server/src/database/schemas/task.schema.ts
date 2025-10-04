import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskStatus } from '../../shared/interfaces/task.interface';
import { User } from './user.schema';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    type: String, 
    enum: Object.values(TaskStatus), 
    required: true, 
    default: TaskStatus.PENDING 
  })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedUser: User;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
