export interface IFavorite {
    games_id: string;
}

export interface IFavorites {
    favorite_games: IFavoriteResponse[];
}

export interface IFavoriteResponse {
    id: string;
    user_created: {
        id: string;
    }
    games_id: string;
}

export interface IFavoriteId  {
    id: string;
}