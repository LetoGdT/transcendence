import {WebSocketGateway,
		OnGatewayConnection,
		SubscribeMessage,
		MessageBody,
		WebSocketServer,
} from '@nestjs/websockets';
import {Server,
		Socket,
} from 'socket.io';
interface Connection {
	user: string;
	client: Socket;
}

@WebSocketGateway()
export class MySocket implements OnGatewayConnection{
	@WebSocketServer()
	server: Server;
	clients: [Connection];

	handleConnection(client: Socket) {
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
