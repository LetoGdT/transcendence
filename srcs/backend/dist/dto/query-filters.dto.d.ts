import { User } from '../typeorm/user.entity';
export declare class UserQueryFilterDto {
    id: number;
    uid: number;
    username: string;
    email: string;
    image_url: string;
}
export declare class MessageQueryFilterDto {
    id: number;
    sender: User;
    recipient: User;
    sent_date: string;
    received_date: string;
}
