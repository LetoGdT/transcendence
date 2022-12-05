import {WebSocketGateway,
		OnGatewayConnection,
		OnGatewayDisconnect,
		SubscribeMessage,
		MessageBody,
		WebSocketServer,
} from '@nestjs/websockets';
import {Server,
		Socket,
} from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { User } from '../typeorm/user.entity';
import { ChatService } from './chat.service';

interface Connection {
	user: User;
	client: Socket;
}

@WebSocketGateway(9998)
export class MySocketGateway implements OnGatewayConnection, 
										OnGatewayDisconnect {
	constructor(private readonly auth: AuthService,
				private readonly chat: ChatService,
			   	private clients: Connection[]) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket) {
		// Vérification du token de l’utilisateur
		// Si le token est invalide, la socket est de fermée de suite
		if(!this.auth.verifyToken(client.request.headers.cookie))
			client.disconnect();
		let token = client.request.headers.cookie;
		let user = await this.auth.tokenOwner(token);
		this.clients.push({user, client});
		console.log(user.username + " has connected to the websocket");
	}

	async handleDisconnect(client: Socket) {
		let index = this.clients.findIndex(element => element.client == client);
		if (index != -1) {
			console.log(this.clients[index].user.username + " has disconnected from the websocket.");
			this.clients.splice(index, 1);
		}
	}

	@SubscribeMessage('newMessage')
	onNewMessage(client: Socket, @MessageBody() body: any) {
		console.log(body);
		// il faut envoyer le message à la bonne personne et le mettre dans la bdd
	}

	@SubscribeMessage('getMoreMessages')
	getMoreMessages(client: Socket, @MessageBody() othersId: {id: number}) {
	}

	@SubscribeMessage('getTailMessages')
	getTailMessages(client: Socket, @MessageBody() id: number) {
		let cookie = client.request.headers.cookie;
		return this.chat.getTailMessages(id, cookie);
	}

	@SubscribeMessage('deleteMessages')
	deleteMessages(client: Socket, @MessageBody() messageId: {id: number}) {
	}

	@SubscribeMessage('modifyMessages')
	modifyMessages(client: Socket, @MessageBody() messageId: {id: number}) {
	}

	sendMessage(recipient: Socket) {
	}
}
