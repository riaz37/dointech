export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface ITask {
  _id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUser: string; // User ID
  dueDate: Date;
  createdBy: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskResponse {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUser: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  dueDate: Date;
  createdBy: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskFilters {
  status?: TaskStatus;
  assignedUser?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
}
