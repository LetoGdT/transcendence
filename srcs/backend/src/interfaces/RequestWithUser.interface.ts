import { Request } from '@nestjs/common';
import { User } from '../typeorm/user.entity';
export interface RequestWithUser extends Request
{
    user: User;
    cookies: any
}