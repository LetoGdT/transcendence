import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Socket } from 'socket.io';
import { User } from '../typeorm/user.entity';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';
import { Connection } from '../interfaces/connection.interface';
import { Game } from './game/game.class';

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

	searchOpponent(queue: Map<number, Connection[]>, client_exp: number): Connection | null
	{
		let index = -1;
		for (let [exp, connection] of queue)
		{
			if (connection.length > 0 && Math.abs(client_exp - exp) < Math.abs(client_exp - index))
				index = exp;
		}

		if (index != -1)
		{
			const ret = queue.get(index)[0];
			queue.get(index).splice(0);
			return ret;
		}
		return null;
	}

	async startGame(client: Connection, opponent: Connection, games: Game[])
	{
		const game = new Game(50, 'Ranked');
		game.addPlayer({ user: client.user, client: client.client });
		game.addPlayer({ user: opponent.user, client: opponent.client });
		client.client.emit('gameFound');
		opponent.client.emit('gameFound');
		games.push(game);
		game.run();
	}
}
