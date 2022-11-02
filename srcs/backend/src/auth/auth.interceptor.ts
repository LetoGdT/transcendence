import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor
{
	constructor(private readonly authService: AuthService,) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>
	{
		const request = context.switchToHttp().getRequest();
		const access_token = request.cookies['access_token'];
		if (access_token)
		{
			const user = await this.authService.tokenOwner(access_token);
			request.user = user;
		}
		return next.handle();
	}
}
