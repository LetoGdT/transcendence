import './App.css'
import './Chat.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import Avatar from './link_botw_avatar.jpg';
import Banniere from './link_botw_banniere.jpg';

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

export function Chat(){
	return(
		<div>
			<h1>Chat</h1>
			<div className='Chat-container'>
				<div className='Chat-navigate'>
					<div>channel 1</div>
					<div>channel 2</div>
					<div>Amigo 1</div>
				</div>
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
							<div className='Chat-message-from-self-lvl1'>
								<div className='Chat-div-empty'></div>
								<div className='Chat-message-from-self-lvl2'>
									message de soi
								</div>
								<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
							</div>
							<div className='Chat-message-from-self-lvl1'>
								<div className='Chat-div-empty'></div>
								<div className='Chat-message-from-self-lvl2'>
									vraiment très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très long long long looooooooooooooooooooooooooong long message de soi
								</div>
								<img src={Avatar} alt={'self-name'} className='Chat-who'></img>
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
									vraiment très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très très long long long looooooooooooooooooooooooooong long message d'autrui
								</div>
								<div className='Chat-div-empty'></div>
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
					</div>
					<div className='Chat-TextField-send-button'>
						<div className='Chat-TextField'>
						<TextareaAutosize
      maxRows={4}
      aria-label="maximum height"
      placeholder="Maximum 4 rows"
      
      style={{ width: 200, borderRadius: "10px"}}
    /> 
								{/* <MessageTextField
									label="Message"
									fullWidth
									multiline
									InputLabelProps={{
										sx:{
											color:"white",
										}
									}}
									variant="outlined"
									// sx={{ input: { color: 'white' } }}
									style={{ color: "#656565" }}
								/> */}
							
						</div>
						<div className='Chat-send-button'>
							<SendButton variant="contained" disableRipple>Send</SendButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}