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
	async onNewMessage(chanOrConv: number, isChannel: boolean, token: string) {
		let res: {users: number[], latest_sent: Date} = {users: [], latest_sent: new Date()};

		await fetch(`http://localhost:9999/api/${isChannel?'channels':'conversations'}/?id=${chanOrConv}`, {
			method: "GET",
			credentials: 'include',
			headers: {
				'Cookie': `access_token=${token}`,
			}
		})
		.then(response=>response.json())
		.then(data => data.data[0])
		.then((elem) => {
				res.latest_sent = elem.latest_sent;
				if (!isChannel) {
					res.users = res.users.concat(elem.user1.id);
					res.users = res.users.concat(elem.user2.id);
				}
				else {
					elem.users.forEach((user: any) => {
						res.users = res.users.concat(user.id);
					});
				}
		});
		return res;
	}
}
