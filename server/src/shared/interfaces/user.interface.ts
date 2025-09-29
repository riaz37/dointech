export interface IUser {
  _id?: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginResponse {
  user: IUserResponse;
  accessToken: string;
}
