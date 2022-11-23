import {WebSocketGateway,
		OnGatewayConnection,
		SubscribeMessage,
		MessageBody,
		WebSocketServer,
} from '@nestjs/websockets';
import {Server,
		Socket,
} from 'socket.io';
import { AuthService } from '../auth/auth.service';

interface Connection {
	user: string;
	client: Socket;
}

@WebSocketGateway(9998)
export class MySocketGateway implements OnGatewayConnection{
	constructor(private readonly auth: AuthService) {}
	@WebSocketServer()
	server: Server;
	clients: [Connection];

	async handleConnection(client: Socket) {
		// Vérification du token de l’utilisateur
		// Si le token est invalide, la socket est de fermée de suite
		if(!this.auth.verifyToken(client.request.headers.cookie))
			client.disconnect();
		let token = client.request.headers.cookie;
		let user = await this.auth.tokenOwner(token);
		console.log(user);
	}

	@SubscribeMessage('newMessage')
	onNewMessage(client: Socket, @MessageBody() body: any) {
		console.log(body);
		// il faut aussi créer un guard pour vérifier l'auth de l'utilisateur
		// il faut envoyer le message à la bonne personne et le mettre dans la bdd
	}

	@SubscribeMessage('getAllMessages')
	getAllMessages(client: Socket) {
	}

	@SubscribeMessage('getTailMessages')
	getTailMessages(client: Socket) {
	}

	sendMessage(recipient: Socket) {
	}
}
