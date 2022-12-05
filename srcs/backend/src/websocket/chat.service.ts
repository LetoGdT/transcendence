import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Socket } from 'socket.io';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { PostPrivateDto, UpdateMessageDto } from '../dto/private-messages.dto';
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';

@Injectable()
export class ChatService {
	private readonly http = new HttpService();

	async getTailMessages(othersId: number, cookie: string) {
		const headersRequest = {
			access_token: cookie,
			withCredentials: 'true',
		};
		return this.http.get(
			"localhost:9999/privmsg/" +
				"?Order=DESC",
			{
				headers: headersRequest,
			},
		);
	}
}
