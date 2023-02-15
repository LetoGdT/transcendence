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

export const Notification = (notif: string[]) => {
	notif.forEach((errorMsg: string) => {
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
	disableNewMessageNotificationsFn();
	socket.on("newMessage", () => {
		newMessage();

		return () => {
			socket.off("newMessage");
		}
	});
	socket.on("newConv", () => {
		newMessage();

		return () => {
			socket.off("newConv");
		}
	});
}

export const setUpNewGameNotificationFn = () => {
	socket.off("newGame");
	socket.on("newGame", () => {
		newGame();

		return () => {
			socket.off("newGame");
		}
	});
}

export const disableNewMessageNotificationsFn = () => {
	socket.off("newMessage");
	socket.off("newConv");
}
