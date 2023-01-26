
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
	socket.on("newMessage", () => {
		newMessage();

		return () => {
			socket.off("newMessage", newMessage);
		}
	});
	socket.on("newConv", () => {
		newMessage();

		return () => {
			socket.off("newConv", newMessage);
		}
	});
}

export const disableNewMessageNotificationsFn = () => {
	socket.off("newMessage", newMessage);
	socket.off("newConv", newMessage);
}
