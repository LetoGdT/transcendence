import './App.css'
import './Chat.css'
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import { PleaseConnect } from './adaptable-zone';

const MessageTextField = styled(TextField)({
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

function DisplayMessage(props: any){
	const message: Message = props?.message;	
	const me: User = props?.me;

	if (message.sender.id === me.id){
		return(
			<div className='Chat-message-from-self-lvl1'>
				<div className='Chat-div-empty'></div>
				<div className='Chat-message-from-self-lvl2'>
					{message.content}
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
					{message.content}
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

	if (conv.new_message === true){
		return(
			<div className='Chat-navigate-new-message'>
				{conv.name}
			</div>
		);
	} else {
		return(
			<div>
				{conv.name}
			</div>
		);
	}
}

function ChatNavigate(props: any) {
	return(
		<div className='Chat-navigate'>
			{props?.conv_list?.map((conv: Conversation) => {
				return (
					<DisplayChannel conv={conv} key={conv.id}/>
				);
			})}
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

export class Chat extends React.Component<{}, { current_conv: number,
												isChannel: boolean,
												current_user: User,
												messages: Message[],
												conv_list: Conversation[] }> {
	constructor(props: any) {
		super(props);
		this.state = {
			current_conv: 1,
			isChannel: false,
			current_user: {id: -1, username: "", image_url: ""},
			messages: [],
			conv_list: []
		};
	}

	updateConv_list() {
		// Set the list of conversations for chat-navigate
		//
		// penser à faire le fetch pour les channels, et à les trier par ordre de date
		fetch('http://localhost:9999/api/conversations/', {
			method: "GET",
			credentials: 'include'
		})
		.then(response=>response.json())
		.then(data => this.setState({conv_list: [].concat(data.data.map((elem: any) => {
			let name: string;
			if (this.state.current_user.id === -1)
				name = "not leaded";
			else if (this.state.current_user.id === elem.user1.id)
				name = elem.user2.username;
			else
				name = elem.user1.username;
			return ({
				id: elem.id,
				is_channel: false,
				date_of_last_message: elem.latest_sent,
				name: name,
				new_message: false
			});
		}))}));

		fetch('http://localhost:9999/api/channels/', {
			method: "GET",
			credentials: 'include'
		})
		.then(response=>response.json())
		.then(data => this.setState({conv_list: this.state.conv_list.concat(data.data.map((elem: any) => {
			return ({
				id: elem.id,
				is_channel: true,
				date_of_last_message: elem.latest_sent,
				name: elem.name,
				new_message: false
			});
		}))}));

	// penser à gérer la conservation de la var new_message

			// The condition is necessary because the users/me fetch request is async
		if (this.state.conv_list.length !== 0)
			this.setState({current_conv: this.state.conv_list[0].id});
	}

	updateUsersMe() {
		// set Current_user_id
		fetch('http://localhost:9999/api/users/me/', {
			method: "GET",
			credentials: 'include'
		})
		.then(response=>response.json())
		.then(data => this.setState({ current_user: {id: data.id,
													 username: data.username,
													 image_url: data.image_url}}));
	}

	updateMessages() {
		// Fetch messages according to the selected conversation or channel
		if (this.state.current_conv !== -1) {
			let uri: string = 'http://localhost:9999/api/';
			if (this.state.isChannel)
				uri += 'channels/';
			else 
				uri += 'conversations/';
			uri += this.state.current_conv +
				'/messages?order=DESC';
			fetch(uri, {
				method: "GET",
				credentials: 'include'
			})
			.then(response=>response.json())
			.then(data => this.setState({ messages: data?.data.map((elem: any) => {
				return ({
					id: elem.id,
					content: elem.content,
					sender: {
						id: elem.sender.id,
						username: elem.sender.username,
						image_url: elem.sender.image_url
					}
				});
			})}));
		}
	}

	setCurrentConv(id: number, isChannel: boolean) {
		this.setState({ current_conv: id, isChannel: isChannel });
	}

	componentDidMount() {
		this.updateUsersMe();
		this.updateConv_list();
		this.updateMessages();
	}

	render() {
		/*
		const [newMessage, setNewMessage] = React.useState("");
		
		const handleInputMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setNewMessage(e.target.value);
		}

		const handleSendMessage = async (event: React.MouseEvent<HTMLButtonElement>) => {
			const response = await fetch(`http://localhost:9999/api/conversations/${this.state.current_user_id}/messages`, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({content: newMessage})
			});
		}
		*/

		return(
			<React.Fragment>
				<h1>Chat</h1>
				<div className='Chat-container'>
					<ChatNavigate conv_list={this.state.conv_list}/>
					<div>
						<DisplayMessageHistory messages={this.state.messages} me={this.state.current_user}/>
						<div className='Chat-TextField-send-button'>
							<div className='Chat-TextField'>
								<TextareaAutosize
									maxRows={4}
									aria-label="maximum height"
									placeholder="Message"
									
									style={{ width: "100%", borderRadius: "10px"}}
									// onChange={handleInputMessage}
								/> 
							</div>
							<div className='Chat-send-button'>
								<SendButton variant="contained" disableRipple
								// onClick={handleSendMessage}
								>Send</SendButton>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
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

