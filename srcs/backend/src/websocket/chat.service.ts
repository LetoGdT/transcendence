import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Socket } from 'socket.io';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
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
			/*** DEPRECATED ! ***/
			"localhost:9999/privmsg/" +
				"?Order=DESC",
			{
				headers: headersRequest,
			},
		);

		/**
		 * New way of doing: Get latest conversations at 'http://localhost:9999/conversations',
		 * save the id, then get the messages
		 * at 'http://localhost:9999/conversations/<conversation_id>/messages', where conversation_id
		 * is the id saved earlier.
		 **/
	}

	async onNewMessage() {
		/**
		 * Create a message at POST 'http://localhost:9999/conversations/<conversation_id>/messages'
		 * with body: { content : 'The message's content' }
		 **/
	}
}
