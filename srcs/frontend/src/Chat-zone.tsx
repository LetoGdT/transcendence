import './App.css'
import './Chat.css'
import React, { useState, useEffect } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';

import { PleaseConnect } from './adaptable-zone';
import { socket } from './WebsocketContext';
import { getAllPaginated } from './tools';
import { disableNewMessageNotificationsFn, setUpNewMessageNotificationsFn } from './Notifications'

const PassawordTextField = styled(TextField)({
	'& input:valid + fieldset': {
		borderColor: 'white',
		borderWidth: 2,
	},
	'& input:invalid + fieldset': {
		borderColor: 'red',
		borderWidth: 2,
	},
	'& input:valid:focus + fieldset': {
		borderLeftWidth: 6,
		padding: '4px !important', // override inline-style
	},
});

const CreateChannelButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#3b9b3b',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#4a7a4a',
		borderColor: '#646464',
	},
	'&:focus': {
		xShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

const LeaveButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#bb1d03',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#891d03',
		borderColor: '#646464',
	},
	'&:focus': {
		boxShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},  
});

const SendButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#3b9b3b',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#4a7a4a',
		borderColor: '#646464',
	},
	'&:focus': {
		xShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

const ChannelButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '0px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#000000',
	borderColor: '#000000',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#007dd6',
		borderColor: '#000000',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#000000',
		borderColor: '#000000',
	},
	'&:focus': {
		xShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

const ChannelSelectedButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	fontWeight: 'bold',
	padding: '0px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#000000',
	borderColor: '#000000',
	color: '#4a7a4a',
	fontFamily: [
		'-appel-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'snans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#007dd6',
		borderColor: '#000000',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#000000',
		borderColor: '#000000',
	},
	'&:focus': {
		xShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

const ChannelButtonNewMessage = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	fontWeight: 'bold',
	padding: '0px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#000000',
	borderColor: '#000000',
	color: '#ffd700',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#007dd6',
		borderColor: '#000000',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#000000',
		borderColor: '#000000',
	},
	'&:focus': {
		xShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

function DisplayMessage(props: any){
	const message: Message = props?.message;	
	const me: User = props?.me;

	if (message.sender.id === me.id){
		return(
			<div className='Chat-message-from-self-lvl1'>
				<div className='Chat-div-empty'></div>
				<div className='Chat-message-from-self-lvl2'>
					<p className='p.chat'>{message.content}</p>
				</div>
				<img src={me.image_url} alt={me.username} className='Chat-who'></img>
			</div>
		);
	} else {
		var uid : string = message.sender.id.toString();
		var url : string = "/otherprofile/";
		url = url.concat(uid);
		return(
			<div className='Chat-message-from-other-lvl1'>
				<Link to={url}>
					<img src={message.sender.image_url} alt={message.sender.username} className='Chat-who'></img>
				</Link>
				<div className='Chat-message-from-other-lvl2'>
					<p className='p.chat'>{message.content}</p>
				</div>
				<div className='Chat-div-empty'></div>
			</div>
		);
	}
}

function DisplayMessageHistory(props: any) {
	return (
		<div className='Chat-history-container'>
			{props?.messages?.map((elem: Message) => {
				return (
					<DisplayMessage message={elem} me={props?.me} key={elem.id}/>
				); 
			})}
		</div>
	);
}

function DisplayChannel(props: any){
	const conv = props?.conv;
	const currentConv = props?.currentConv;

	if (currentConv === conv?.id)
		return (
			<div>
				<ChannelSelectedButton variant="contained" disableRipple onClick={props?.handleChangeConv} value={conv.id}>
					{conv.name}
				</ChannelSelectedButton>
			</div>
		);
	else if (conv.new_message === true){
		return(
			<div>
				<ChannelButtonNewMessage variant="contained" disableRipple onClick={props?.handleChangeConv} value={conv.id}>
					{conv.name}
				</ChannelButtonNewMessage>
			</div>
		);
	} else {
		return(
			<div>
				<ChannelButton variant="contained" disableRipple onClick={props?.handleChangeConv} value={conv.id}>
					{conv.name}
				</ChannelButton>
			</div>
		);
	}
}

function ChatNavigate(props: any) {
	return(
		<div className='Chat-navigate'>
			{props?.ConvList?.map((conv: Conversation) => {
				return (
					<DisplayChannel conv={conv} currentConv={props?.currentConv} key={conv.id} handleChangeConv={props?.handleChangeConv}/>
				);
			})}
		</div>
	);
}

function DisplayChannelAvailable(props: any){
	const channel = props?.channel;
	const currentUser = props?.currentUser;
	const [password, setPassword] = React.useState("");

	const handleJoin = async (event: any) => {
		await fetch(`http://localhost:9999/api/channels/${event.target.value}/users`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({password: password})
		})
		.then(response => {
			if (!response.ok)
				return ;
		});
	}

	const handleLeave = async (event: any) => {
		await fetch(`http://localhost:9999/api/channels/${event.target.channel_id}/${currentUser.id}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE',
			credentials: 'include',
		})
		.then(response => {
			if (!response.ok)
				return ;
		});
	}

	const handleInputPassword = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPassword(e.target.value);
	};

	const isIn = channel.users.find(({ id }: any) => id === currentUser.id);
	const isBan = channel.banlist.find(({ id }: any) => id === currentUser.id);

	if (typeof isBan === "undefined"){
		if (typeof isIn === "undefined" && channel.status === 'public'){
			return(
				<div className='Channels-available-div'>
					<div>
						{channel.name}
					</div>
					<div>
						<CreateChannelButton variant="contained" disableRipple onClick={handleJoin} value={channel.id}>Join</CreateChannelButton>
					</div>
				</div>
			);
		} else if (typeof isIn === "undefined" && channel.status === 'protected'){
			return(
				<div className='Channels-available-div'>
					<div>
						{channel.name}
					</div>
					<div>
						<Box
							component="form"
							noValidate
							sx={{
								display: 'grid',
								gap: 2,
							}}
						>
							<PassawordTextField
								label="Password"
								InputLabelProps={{
								sx:{
									color:"white",
								}
								}}
								variant="outlined"
								sx={{ input: { color: 'grey' } }}
								id="validation-outlined-input"
								onChange={handleInputPassword}
							/>
						</Box>
					</div>
					<div>
						<CreateChannelButton variant="contained" disableRipple onClick={handleJoin}>Join</CreateChannelButton>
					</div>
				</div>
			);
		} else {
			return(
				<div className='Channels-available-div'>
					<div>
						{channel.name}
					</div>
					<div>
						<LeaveButton variant="contained" disableRipple onClick={handleLeave} value={channel.id}>Leave</LeaveButton>
					</div>
				</div>
			);
		}
	} else {
		return (<React.Fragment></React.Fragment>);
	}
}

function ChannelList(props: any) {
	return (
		<div className='Channels-available'>
			{
				props?.channelsAvailable?.map((channel:any) => {
					return(
						<DisplayChannelAvailable channel={channel} currentUser={props?.currentUser}/>
					);	
				})
			}
			<div className='Channels-available-div2'>
				<Link to="/setchannel">
					<CreateChannelButton variant="contained" disableRipple>Create a channel</CreateChannelButton>
				</Link>
			</div>
		</div>
	);
}

type User = {
	id: number;
	username: string;
	image_url: string;
}

type Message = {
	id: number;
	content: string;
	sender: User;
}

type Conversation = {
	id: number;
	is_channel: boolean;
	date_of_last_message: Date;
	name: string;
	new_message: boolean;
}

type ChannelUser = {
	id: number;
	user: User;
	role: 'None' | 'Admin' | 'Owner';
	is_muted: Boolean;
	channel: Channel;
}

type ChannelBan = {
	id: number;
	user: User;
	unban_date: Date;
	channel: Channel;
}

type Channel = {
	id: number;
	name: string;
	users: ChannelUser[];
	messages: Message[];
	status: string;
	latest_sent: Date;
	ban_list: ChannelBan[];
	password: string;
}

function Chat() {
	const [currentConv, setCurrentConv] = useState<number>(-1);
	const [isChannel, setIsChannel] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<User>({id: -1,
														  username: "",
														  image_url: ""});
	const [messages, setMessages] = useState<Message[]>([]);
	const [convList, setConvList] = useState<Conversation[]>([]);
	const [newMessage, setNewMessage] = React.useState("");
	const [channelsAvailable, setChannelsAvailable] = React.useState<Channel[]>([]);
		
	useEffect(() => {
		disableNewMessageNotificationsFn();
		updateUsersMe();
		updateChannelsAvailable();

		return setUpNewMessageNotificationsFn;
	}, []);

	useEffect(() => {
		updateConvList();
		socket.on("newConv", updateConvList);
	}, [currentUser]);

	useEffect(() => {
		if (currentConv == -1 && convList.length != 0) {
			setCurrentConv(convList[0].id);
			setIsChannel(convList[0].is_channel);
		}
	}, [convList])

	useEffect(() => {
		socket.on('newMessage', (data) => {
			console.log(new Date());
			const convId: number = data?.convId;
			const latest_sent: Date = new Date(data?.latest_sent);
			let res: Conversation[] = [...convList];

			for (var conv of res) {
				if (conv.id === convId) {
					if (conv.id !== currentConv)
						conv.new_message = true;
					conv.date_of_last_message = latest_sent;
					res.sort((a, b) => a.date_of_last_message.getTime() - b.date_of_last_message.getTime());
					setConvList(res);
					continue ;
				}
			}
			if (convId === currentConv) {
				updateMessages();
			}
		});
		
		return () => {
			socket.off('newMessage');
			socket.off('newConvChan');
		}
	}, [convList, currentConv]);

	useEffect(() => {
		updateMessages();
	}, [currentConv])

	async function updateConvList() {
		let res: Conversation[] = [];
		const old_ConvList = convList;

		// Set the list of conversations for chat-navigate
		await fetch('http://localhost:9999/api/conversations/', {
			method: "GET",
			credentials: 'include'
		})
		.then(response=>response.json())
		.then(data => res = res.concat(data.data.map((elem: any) => {
			let name: string;
			if (currentUser.id === -1)
				name = "not loaded";
			else if (currentUser.id === elem.user1.id)
				name = elem.user2.username;
			else
				name = elem.user1.username;
			return ({
				id: elem.id,
				is_channel: false,
				date_of_last_message: new Date(elem.latest_sent),
				name: name,
				new_message: false
			});
		})));

		await fetch('http://localhost:9999/api/channels/', {
			method: "GET",
			credentials: 'include'
		})
		.then(response=>response.json())
		.then(data => res = res.concat(data.data.map((elem: any) => {
			return ({
				id: elem.id,
				is_channel: true,
				date_of_last_message: new Date(elem.latest_sent),
				name: elem.name,
				new_message: false
			});
		})));

		old_ConvList.forEach((elem: Conversation) => {
			let index;
			for (index = 0 ; index < res.length ; index++)
				if (res[index].id == elem.id)
					continue ;
			if (index != res.length)
				res[index].new_message = elem.new_message;
		});
		setConvList(res);
	}

	async function updateUsersMe() {
		// set Current_user_id
		await fetch('http://localhost:9999/api/users/me/', {
			method: "GET",
			credentials: 'include'
		})
		.then(response=>response.json())
		.then(data => setCurrentUser({id: data.id,
									  username: data.username,
									  image_url: data.image_url}));
	}

	async function updateMessages() {
		// Fetch messages according to the selected conversation or channel
		if (currentConv !== -1) {
			let url: string = '';
			if (isChannel)
				url += 'channels/';
			else 
				url += 'conversations/';
			url += currentConv +
				'/messages';
			getAllPaginated(url, {params: new URLSearchParams({order: "DESC"})})
			.then(data => setMessages(data.map((elem: any) => {
				return ({
					id: elem.id,
					content: elem.content,
					sender: {
						id: elem.sender.id,
						username: elem.sender.username,
						image_url: elem.sender.image_url
					}
				});
			})));
		}
	}

	async function updateChannelsAvailable() {
			const url = 'channels';

			getAllPaginated(url, {params: new URLSearchParams({order: "DESC"})})
			.then(data => setChannelsAvailable(data));
	}

	const handleChangeConv= async (event: any) => {
		const id = event.target.value;
		let convs = [...convList];
		for (var elem of convs)
			if (elem.id === id) {
				setCurrentConv(id);
				setIsChannel(elem.is_channel);
				elem.new_message = false;
				setConvList(convs);
				continue ;
			}
	}

	const handleInputMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewMessage(e.target.value);
	}

	const handleSendMessage = async () => {
		if (newMessage.length === 0)
			return ;
		await fetch(`http://localhost:9999/api/${isChannel?'channels':'conversations'}/${currentConv}/messages`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({content: newMessage})
		})
		.then(response => {
			if (!response.ok)
			return ;
		});
		socket.emit("newMessage", {convId: currentConv, isChannel: isChannel});
		setNewMessage(""); // Sert à effacer le message une fois qu'on a appuyé sur le bouton send
	}

	return (
			<React.Fragment>
				<h1>Chat</h1>
				<div className='Chat-container'>
					<ChatNavigate ConvList={convList} currentConv={currentConv} handleChangeConv={handleChangeConv}/>
					<div>
						<DisplayMessageHistory messages={messages} me={currentUser}/>
						<div className='Chat-TextField-send-button'>
							<div className='Chat-TextField'>
								<TextareaAutosize
									maxRows={4}
									aria-label="maximum height"
									placeholder="Message"
									value={newMessage}
									
									style={{ width: "100%", borderRadius: "10px"}}
									onChange={handleInputMessage}
								/> 
							</div>
							<div className='Chat-send-button'>
								<SendButton variant="contained" disableRipple
								onClick={handleSendMessage}
								>Send</SendButton>
							</div>
						</div>
					</div>
					<div className='empty'></div>
					<ChannelList channelsAvailable={channelsAvailable} currentUser={currentUser} />
				</div>
			</React.Fragment>
	)
}

type meProps = {
	id: number;
	username: string;
	image_url: string;
}

export function ChatZone(){
	const [me, setMe] = useState<meProps>();

	useEffect(() => {
		const api = async () => {
			const data = await fetch("http://localhost:9999/api/users/isconnected", {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setMe(jsonData);
		};
	
		api();
	}, []);
	
	const isLoggedIn = me;
	if (isLoggedIn){
		return (
			<Chat />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		 );
	}
}

