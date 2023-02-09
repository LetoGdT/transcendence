import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Socket } from 'socket.io';
import { User } from '../typeorm/user.entity';
import { MatchesService } from '../matches/matches.service';
import { PageDto } from "../dto/page.dto";
import { PageOptionsDto } from "../dto/page-options.dto";
import { MessageQueryFilterDto } from '../dto/query-filters.dto';
import { UserSelectDto } from '../dto/messages.dto';
import { CreateMatchDto } from '../dto/matches.dto';
import { Connection } from '../interfaces/connection.interface';
import { Game } from './game/game.class';
import { ChannelUser } from '../typeorm/channel-user.entity';

@Injectable()
export class ChatService {
	async onNewMessage(chanOrConv: number, isChannel: boolean, token: string) {
		let res: {users: number[], latest_sent: Date} = {users: [], latest_sent: new Date()};

		await fetch(`http://localhost:9999/api/${isChannel?'channels':'conversations'}/?id=${chanOrConv}`, {
			method: "GET",
			credentials: 'include',
			headers: {
				'Cookie': `access_token=${token}`,
			}
		})
		.then(response => {
			if (response.ok)
				return response.json();
		})
		.then(data => {if (data !== undefined) return data.data[0];})
		.then(elem => {if (elem !== undefined) {
				res.latest_sent = elem.latest_sent;
				if (!isChannel) {
					res.users = res.users.concat(elem.user1.id);
					res.users = res.users.concat(elem.user2.id);
				}
				else {
					elem.users.forEach((channelUser: ChannelUser) => {
						res.users = res.users.concat(channelUser.user.id);
					});
				}
		}});
		return res;
	}

	constructor(private readonly matchesService: MatchesService) {}

	searchOpponent(queue: Map<number, Connection[]>, client_exp: number, user_id: number): Connection | null
	{
		let index = -1;
		for (let [exp, connections] of queue)
		{
			// if (exp == client_exp && connections.length === 1)
			// {
			// 	console.log('Breaks');
			// 	continue;
			// }
			if (connections.length > 0 && Math.abs(client_exp - exp) < Math.abs(client_exp - index))
				index = exp;
		}

		if (index != -1)
		{
			let ret = queue.get(index)[0];
			if (ret.user.id == user_id)
			{
				ret = queue.get(index)[1];
				queue.get(index).splice(1);
				return ret;
			}
			queue.get(index).splice(0);
			return ret;
		}
		return null;
	}

	async startGame(client: Connection, opponent: Connection, games: Game[])
	{
		// const game = new Game(50, 'Ranked');
		// game.addPlayer({ user: client.user, client: client.client });
		// game.addPlayer({ user: opponent.user, client: opponent.client });
		// client.client.emit('gameFound');
		// opponent.client.emit('gameFound');
		// games.push(game);
		// await game.run();
		// const gameIndex: number = games.findIndex(async game => {
		// 	(await game.getPlayer1Id()) == client.user.id
		// 	&& (await game.getPlayer2Id()) == opponent.user.id
		// });
		// games.splice(gameIndex, 1);
		// const score: { player1: number, player2: number } = await game.getScore(1);
		// const winner: User = score.player1 === 5 ? client.user : opponent.user;
		// const createMatchDto: CreateMatchDto = {
		// 	user1: client.user,
		// 	user2: opponent.user,
		// 	score_user1: score.player1,
		// 	score_user2: score.player2,
		// 	winner: winner,
		// 	played_at: new Date(),
		// 	game_type: 'Ranked',
		// };
		// const match = await this.matchesService.createMatch(createMatchDto);
		// this.matchesService.calculateRank(match.id);
	}

	printQ(queue: Map<number, Connection[]>)
	{
		let users: User[] = [];
		for (let connections of queue.values())
			users = [...users, ...connections.map((connection) => connection.user)];
		console.log(users);
	}
}
