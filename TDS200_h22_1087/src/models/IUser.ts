export interface IUser {
    first_name: string;
    email: string;
    avatar: string;
    id: string;
}

export interface IUserResponse {
    user: IUser[];
}
