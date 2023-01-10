import './App.css'
import './Settings.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";

import { PleaseConnect } from './adaptable-zone';
import { Activate2FA } from './activate2fa' 

type resultProps = {
	username: string;
	email: string;
	image_url: string;
	enabled2fa: boolean;
};

const SettingsTextField = styled(TextField)({
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

const SettingsButton = styled(Button)({
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

const TwoFASwitch = styled(Switch)(({ theme }) => ({
	width: 28,
	height: 16,
	padding: 0,
	display: 'flex', '&:active': {
		'& .MuiSwitch-thumb': {
			width: 15,
		},
		'& .MuiSwitch-switchBase.Mui-checked': {
			transform: 'translateX(9px)',
		},
	},
	'& .MuiSwitch-switchBase': {
		padding: 2,
		'&.Mui-checked': {
			transform: 'translateX(12px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: theme.palette.mode === 'dark' ? '#177d00' : '#189000',
			},
		},
	},
	'& .MuiSwitch-thumb': {
		boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
		width: 12,
		height: 12,
		borderRadius: 6,
		transition: theme.transitions.create(['width'], {
			duration: 200,
		}),
	},
	'& .MuiSwitch-track': {
		borderRadius: 16 / 2,
		opacity: 1,
		backgroundColor: 'rgba(187,29,3,1)',
		boxSizing: 'border-box',
	},
}));

function SendNewAvatar(newAvatar: string | undefined){
	React.useEffect(() => {
		const api = async () => {
			const response = await fetch('http://localhost:9999/api/users/me?',{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({image_url: newAvatar})
			});
		};

	}, []);	
}


function Desactivate2FA(){
	React.useEffect(() => {
		const api = async () => {
			const response = await fetch('http://localhost:9999/api/2fa/disable',{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				credentials: 'include',
			});
		};

	}, []);	
}

// function ValidateButton(newAlias: string | undefined, newAvatar: string | undefined){
// 	if (newAlias !== undefined){
// 		SendNewAlias(newAlias);
// 	}
// 	if (newAvatar !== undefined){
// 		SendNewAvatar(newAvatar);
// 	}
// }

export function Settings(){
	const [data, setResult] = useState<resultProps>();
	const [newAvatar, setNewAvatar] = React.useState("");
	const [newAlias, setNewAlias] = React.useState("");

	useEffect(() => {
		const api = async () => {
			const data = await fetch("http://localhost:9999/api/users/me", {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);
		};
	
		api();
	}, []);

	const handleInputAvatar = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewAvatar(e.target.value);
		console.log(newAvatar);//
		// SendNewAvatar(newAvatar);
	};

	const handleInputAlias = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewAlias(e.target.value);
		// SendNewAlias(newAlias);
	};
	// console.log(newAlias);//

	const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		console.log(checked);//
		if (checked === true){
			
		} else {

		}
	}

	const handleValidate = async (event: React.MouseEvent<HTMLButtonElement>) => {
		if (newAlias !== undefined){
			// SendNewAlias(newAlias);
			console.log(newAvatar);
		}
		// if (newAvatar !== undefined){
		// 	SendNewAvatar(newAvatar);
		// }
	}

	function SendNewAlias(newAlias: string | undefined):React.ReactElement{
		React.useEffect(() => {
			const api = async () => {
				const response = await fetch('http://localhost:9999/api/users/me',{
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'PATCH',
					credentials: 'include',
					body: JSON.stringify({username: newAlias})
				});
			};
	
		}, []);	
		return(<div></div>);
	}
	

	React.useEffect(() => {
		const api = async () => {
			const response = await fetch('http://localhost:9999/api/users/me?',{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({image_url: newAvatar})
			});
		};

	}, []);	

	return(
		<React.Fragment>
			<h1>Settings</h1>
			<div className='Settings-container'>
				<div className='Settings-container-div-lvl1'>
					<div className='Settings-container-div-lvl2'>
						<h2>Your avatar</h2>
						<div className='Settings-container-div-lvl3'>
							<div className='Settings-container-div-lvl4'>
								<img src={data?.image_url} alt='your avatar' className='Settings-avatar-img'></img>
							</div>
							<div className='Settings-container-div-lvl4'>
								<Box
									component="form"
									noValidate
									sx={{
										display: 'grid',
										gap: 2,
									}}
								>
									<SettingsTextField
										label="New avatar"
										InputLabelProps={{
										sx:{
											color:"white",
										}
										}}
										variant="outlined"
										defaultValue="*.jpg or *.png"
										sx={{ input: { color: 'grey' } }}
										id="validation-outlined-input"
										onChange={handleInputAvatar}
									/>
								</Box>
							</div>
							{/* <div className='Settings-container-div-lvl4'>
								<SettingsButton variant="contained" disableRipple>Browse</SettingsButton>
							</div> */}
						</div>
					</div>
					<div className='Settings-container-div-lvl2'>
						<h2>Your alias</h2>
						<div className='Settings-container-div-lvl3'>
							<div className='Settings-container-div-lvl4'>
								{data?.username}
							</div>
							<div className='Settings-container-div-lvl4'>
							<Box
									component="form"
									noValidate
									sx={{
										display: 'grid',
										gap: 2,
									}}
								>
									<SettingsTextField
										label="New alias"
										InputLabelProps={{
											sx:{
												color:"white",
											}
										}}
										variant="outlined"
										defaultValue="ex: Toto"
										sx={{ input: { color: 'grey' } }}
										id="validation-outlined-input"
										onChange={handleInputAlias}
									/>
								</Box>
							</div>
							<div>newAlias = {newAlias}</div>
						</div>
					</div>
					{/* <div className='Settings-container-div-lvl2'>
						<h2>2FA - 2 Factor Authentication</h2>
						<div className='Settings-container-div-lvl3'>
							<div className='Settings-container-div-lvl4'>
								<Stack direction="row" spacing={1} alignItems="center">
									<Typography color="common.white">Off</Typography>
										<TwoFASwitch checked={data?.enabled2fa} inputProps={{ 'aria-label': 'ant design' }} onChange={handleSwitch} />
									<Typography color="common.white">On</Typography>
								</Stack>
								
							</div>
						</div>
					</div> */}
						
				</div>
				<div>
					<SettingsButton variant="contained" disableRipple onClick={
						async (event: React.MouseEvent<HTMLButtonElement>) => {
							if (newAlias !== undefined){
								console.log("newAlias n'est pas undefined");
								console.log(newAlias);
								SendNewAlias(newAlias);
								
							}
							// if (newAvatar !== undefined){
							// 	SendNewAvatar(newAvatar);
							// }
						}
					}>Validate change(s)</SettingsButton>
				</div>
				*Fill in the field is not required.
			</div>
		</React.Fragment>
	);
}

type meProps = {
};

export function SettingsZone(){
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
			<Settings />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		);
	}
}