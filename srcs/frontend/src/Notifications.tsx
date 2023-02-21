import './App.css';
import toast from 'react-hot-toast';
import { socket } from './WebsocketContext';

const newGame = () => {
	toast.custom(
		<div className='Notif'>
			You've got a new invitation for a game.<br></br>
			Please go to your profile to accept or reject.
		</div>,
		{
			duration: 5000,
			position: 'top-center',
		
			// Aria
			ariaProps: {
			role: 'status',
			'aria-live': 'polite',
			},
		}
	);
};

const newMessage = () => {
	toast.custom(
		<div className='Notif'>
			You've got a new message in chat.
		</div>,
		{
			duration: 5000,
			position: 'top-center',

			// Aria
			ariaProps: {
			role: 'status',
			'aria-live': 'polite',
			},
		}
	);
};

export const Notification = async (response: Response | string) => {
	let notifs: string[];
	if (response instanceof Response) {
		const data = await response.json();
		if (response.status === 400)
			notifs = data.message;
		else if (response.status === 403) 
			notifs = [data];
		else
			notifs = data;
	}
	else
		notifs = [response];
	notifs.forEach((errorMsg: string) => {
		toast.custom(
			<div className='ErrorNotif'>
				{errorMsg}
			</div>,
			{
				duration: 5000,
				position: 'top-center',

				// Aria
				ariaProps: {
				role: 'status',
				'aria-live': 'polite',
				},
			}
		);
	});
};

export const setUpNewMessageNotificationsFn = () => {
	socket.off('newMessage');
	socket.on("newMessage", newMessage);
}

export const setUpNewGameNotificationFn = () => {
	socket.off("newGame");
	socket.on("newGame", newGame);
}
