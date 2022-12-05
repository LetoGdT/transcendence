export declare class UserQueryFilterDto {
    id: number;
    uid: number;
    username: string;
    email: string;
    image_url: string;
}
export declare class MessageQueryFilterDto {
    id: number;
    message_id?: number;
    start_at: Date;
    end_at: Date;
}
export declare class ChannelQueryFilterDto {
    id: number;
    username: string;
    status: 'public' | 'private' | 'protected';
}
