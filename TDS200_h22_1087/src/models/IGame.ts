export interface IGame {
    id: string;
    images: [{
        id: number;
        games_id: number;
        directus_files_id: {
            id: string;
        }
    }];
    title: string;
    description: string;
    platform: string;
    price: number;
    condition: string;
    address: string;
    place: string;
    zip: string;
}

export interface IGameResponse {
    game: IGame[];
}

export interface IGameDetails {
    id: string;
    images: [{
        id: number;
        games_id: number;
        directus_files_id: {
            id: string;
        }
    }];
    title: string;
    description: string;
    platform: string;
    price: number;
    condition: string;
    address: string;
    place: string;
    zip: string;
    user_created: {
        id: number;
        first_name: string;
        email: string;
        avatar: {
            id: string;
        }
    }
}

export interface IGameDetailsResponse {
    game: IGameDetails[];
}

export interface IGameImage {
    id: string;
    games_id: number;
    directus_files_id: {
        id: string;
    }
}

export interface INewGame {
    title: string;
    description: string;
    platform: string;
    price: number;
    condition: string;
    address: string;
    place: string;
    zip: string;
    images: [{
        directus_files_id: {
            id: string;
        }
    }];
}

export interface IGameImage {
    directus_files_id: {
        id: string;
    }
}

export interface INewGameImages {
    id: string;
}

export interface IGameByUser {
    id: string;
    images: [{
        id: number;
        games_id: number;
        directus_files_id: {
            id: string;
        }
    }];
    title: string;
    description: string;
    user_created: {
        id: string;
    }
    platform: string;
    price: number;
    condition: string;
    address: string;
    place: string;
    zip: string;
}

export interface IGameByUserResponse {
    game: IGameByUser[];
}

export interface IGameById {
    games_by_id: {
        id: string;
        images: [{
            id: number;
            games_id: number;
            directus_files_id: {
                id: string;
            }
        }];
        title: string;
        description: string;
        platform: string;
        price: number;
        condition: string;
        address: string;
        place: string;
        zip: string;
    }
}