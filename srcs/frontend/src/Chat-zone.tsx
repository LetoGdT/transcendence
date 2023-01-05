import './App.css'
import './Chat.css'
import React, { useState, useEffect } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import Avatar from './link_botw_avatar.jpg';
import Banniere from './link_botw_banniere.jpg';

import { PleaseConnect } from './adaptable-zone';

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

export function Chat(){
	return(
		<React.Fragment>
			<h1>Chat</h1>
			<div className='Chat-container'>
				<div className='Chat-navigate'>
					<div>channel 1</div>
					<div>channel 2</div>
					<div>Amigo 1</div>
				</div>
				<div>
					<div className='Chat-history-container'>
						{/* <div className='Chat-message-from-self-lvl1'>
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
						<div className='Chat-message-from-self-lvl1'>
							<div className='Chat-div-empty'></div>
							<div className='Chat-message-from-self-lvl2'>
								message de soi
							</div>
							<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
						</div> */}
						<div className='Chat-message-from-self-lvl1'>
							<div className='Chat-div-empty'></div>
							<div className='Chat-message-from-self-lvl2'>
								vraiment très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très long long long long message de soi
							</div>
							<img src={Banniere} alt={'self-name'} className='Chat-who'></img>
						</div>
						{/* <div className='Chat-message-from-self-lvl1'>
							<div className='Chat-div-empty'></div>
							<div className='Chat-message-from-self-lvl2'>
								message de soi
							</div>
							<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
						</div> */}
						<div className='Chat-message-from-other-lvl1'>
							<img src={Avatar} alt={'other-name'} className='Chat-who'></img>
							<div className='Chat-message-from-other-lvl2'>
								vraiment très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très long long long looooooooooooooooooooooooooong long message d'autrui
							</div>
							<div className='Chat-div-empty'></div>
						</div>
						{/* <div className='Chat-message-from-other-lvl1'>
							<img src={Avatar} alt={'other-name'} className='Chat-who'></img>
							<div className='Chat-message-from-other-lvl2'>
								message d'autrui
							</div>
							<div className='Chat-div-empty'></div>
						</div>
						<div className='Chat-message-from-self-lvl1'>
							<div className='Chat-div-empty'></div>
							<div className='Chat-message-from-self-lvl2'>
								message de soi
							</div>
							<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
						</div>
						<div className='Chat-message-from-other-lvl1'>
							<img src={Avatar} alt={'other-name'} className='Chat-who'></img>
							<div className='Chat-message-from-other-lvl2'>
								message d'autrui
							</div>
							<div className='Chat-div-empty'></div>
						</div>
						<div className='Chat-message-from-self-lvl1'>
							<div className='Chat-div-empty'></div>
							<div className='Chat-message-from-self-lvl2'>
								message de soi
							</div>
							<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
						</div>
						<div className='Chat-message-from-other-lvl1'>
							<img src={Avatar} alt={'other-name'} className='Chat-who'></img>
							<div className='Chat-message-from-other-lvl2'>
								message d'autrui
							</div>
							<div className='Chat-div-empty'></div>
						</div>
						<div className='Chat-message-from-self-lvl1'>
							<div className='Chat-div-empty'></div>
							<div className='Chat-message-from-self-lvl2'>
								message de soi
							</div>
							<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
						</div>
						<div className='Chat-message-from-other-lvl1'>
							<img src={Avatar} alt={'other-name'} className='Chat-who'></img>
							<div className='Chat-message-from-other-lvl2'>
								message d'autrui
							</div>
							<div className='Chat-div-empty'></div>
						</div>
						<div className='Chat-message-from-self-lvl1'>
							<div className='Chat-div-empty'></div>
							<div className='Chat-message-from-self-lvl2'>
								message de soi
							</div>
							<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
						</div>
						<div className='Chat-message-from-other-lvl1'>
							<img src={Avatar} alt={'other-name'} className='Chat-who'></img>
							<div className='Chat-message-from-other-lvl2'>
								message d'autrui
							</div>
							<div className='Chat-div-empty'></div>
						</div>
						<div className='Chat-message-from-self-lvl1'>
							<div className='Chat-div-empty'></div>
							<div className='Chat-message-from-self-lvl2'>
								message de soi
							</div>
							<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
						</div>
						<div className='Chat-message-from-other-lvl1'>
							<img src={Avatar} alt={'other-name'} className='Chat-who'></img>
							<div className='Chat-message-from-other-lvl2'>
								message d'autrui
							</div>
							<div className='Chat-div-empty'></div>
						</div> */}
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