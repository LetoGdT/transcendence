export declare class PostChannelDto {
    name: string;
}
export declare class PatchChannelDto {
    status: 'public' | 'private' | 'protected';
    password: string;
}
export declare class PatchChannelUserDto {
    role: 'None' | 'Admin' | 'Owner';
    is_muted: Boolean;
}
export declare class PostChannelMessageDto {
    content: string;
}
