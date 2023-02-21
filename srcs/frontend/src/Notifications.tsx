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
	let tmp: string | string[];
	if (typeof response !== 'string') {
		const data = await response.json();
		if (response.status === 400)
			tmp = data.message;
		else if (response.status === 403) 
			tmp = [data];
		else
			tmp = data;
	}
	else
		tmp = [response];
	if (typeof tmp === 'string')
		notifs = [tmp];
	else
		notifs = tmp;
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
