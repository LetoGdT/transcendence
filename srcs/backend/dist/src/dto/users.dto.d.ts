export declare class CreateUserDto {
    uid: number;
    username: string;
    email: string;
    image_url: string;
}
export declare class UpdateUserDto {
    username: string;
    email: string;
    image_url: string;
    refresh_token: string;
    refresh_expires: string;
}
