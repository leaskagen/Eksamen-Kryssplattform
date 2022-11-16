export interface IMessage {
    id: string;
    message_text: string;
    sent_to: string;
}

export interface IMessages {
    messages: IMessage[];
}

export interface IMessageResponse {
    id: string;
    message_text: string;
    sent_to: string;
    user_created: {
        id: string;
    }
}

export interface IChat {
    id: string;
    first_name: string;
    avatar: {
        id: string;
    };
}

export interface INewMessage {
    messageText: string;
    sentTo: string;
}