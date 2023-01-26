
import toast from 'react-hot-toast';
import { socket } from './WebsocketContext';

export const newMessage = () => {
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

export const disableNewMessageNotificationsFn = () => {
	socket.off("newMessage");
	socket.off("newConv");
}
