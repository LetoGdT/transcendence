import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Socket } from 'socket.io';
import { User } from '../typeorm/user.entity';

@Injectable()
export class ChatService {
	private readonly http = new HttpService();

	async getTailMessages(othersId: number, cookie: string) {
//		access_token;
		const headersRequest = {
			access_token: cookie,
			withCredentials: 'true',
		};
		const result = this.http.get(
			'localhost:9999/privmsg/', 
			{
				headers: headersRequest,
			});
	}
}
