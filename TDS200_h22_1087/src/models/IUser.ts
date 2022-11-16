export interface IUser {
    first_name: string;
    email: string;
    avatar: string;
    id: string;
}

export interface IUserResponse {
    user: IUser[];
}

export interface ISeller {
    id: string;
    first_name: string;
}

export interface IUserById {
    users_by_id: {
        id: string;
        first_name: string; 
    }
}