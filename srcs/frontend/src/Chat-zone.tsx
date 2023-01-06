import './App.css'
import './Chat.css'
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import Avatar from './link_botw_avatar.jpg';
import Banniere from './link_botw_banniere.jpg';

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

function ChatNavigate(props: any) {
	return(
		<div className='Chat-navigate'>
			{props?.conv_list?.map((obj: Conversation) => {
				return(
					<div key={obj.id}>{obj.name}</div>
				);
			})}
		</div>
	);
}


type Message = {
	sender_uid: number;
	content: string;
	time_sent: Date;
}

type Conversation = {
	id: number;
	name: string;
	new_message: boolean;
}

export class ChatZone extends React.Component<{}, { current_conv: number,
													current_uid: number,
													messages: Message[],
													conv_list: Conversation[] }> {
	constructor(props: any) {
		super(props);
		this.state = {
			current_conv: 0,
			current_uid: 0,
			messages: [],
			conv_list: []
		};
	}

	componentDidMount() {
		fetch('http://localhost:9999/api/conversations/', {
			method: "GET",
			credentials: 'include'
		})
		.then(response=>response.json())
		.then(data => this.setState({conv_list: data.data.map((elem: any) => {
			return {id: elem.id, name: "pouet", new_message: false};
		})}));
	}

	render() {
		return(
			<React.Fragment>
				<h1>Chat</h1>
				<div className='Chat-container'>
					<ChatNavigate conv_list={this.state.conv_list}/>
					<div>
						<div className='Chat-history-container'>
							<div className='Chat-message-from-self-lvl1'>
								<div className='Chat-div-empty'></div>
								<div className='Chat-message-from-self-lvl2'>
									message de soi
								</div>
								<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
							</div>
							<div className='Chat-message-from-other-lvl1'>
								<img src={Banniere} alt={'other-name'} className='Chat-who'></img>
								<div className='Chat-message-from-other-lvl2'>
									message d'autrui
								</div>
								<div className='Chat-div-empty'></div>
							</div>
						</div>
						<div className='Chat-TextField-send-button'>
							<div className='Chat-TextField'>
								<TextareaAutosize
									maxRows={4}
									aria-label="maximum height"
									placeholder="Message"
									
									style={{ width: "100%", borderRadius: "10px"}}
								/> 
							</div>
							<div className='Chat-send-button'>
								<SendButton variant="contained" disableRipple>Send</SendButton>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

/*

type meProps = {
};

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
*/
