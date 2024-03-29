import './App.css'
import './Settings.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from "react";
import { PleaseConnect } from './adaptable-zone';
import { Notification } from './Notifications';

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

const SettingsButton2 = styled(Button)({
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

function ActivateOrDesactivate2FAButton(){
	const [data, setResult] = useState<resultProps>();

	useEffect(() => {
		const api = async () => {
			const data = await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me`, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);
		};
	
		api();
	}, []);

	if(data?.enabled2fa === true){
		return(
			<div className='Settings-container-div-lvl4'>
				<Link to={"/desactivate2fa"}>
					<SettingsButton2 variant="contained" disableRipple>
						Desactivate
					</SettingsButton2>
				</Link>
            </div>
		);
	} else {
		return(
			<div className='Settings-container-div-lvl4'>
				<Link to={"/activate2fa"}>
					<SettingsButton variant="contained" disableRipple >
						Activate
					</SettingsButton>
				</Link>
            </div>
		);
	}
}

function Settings(){
	const [data, setResult] = useState<resultProps>();
	const [newAvatar, setNewAvatar] = React.useState("");
	const [newAlias, setNewAlias] = React.useState("");

	useEffect(() => {
		const api = async () => {
			const data = await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me`, {
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
	};

	const handleInputAlias = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewAlias(e.target.value);
	};

	const handleChangeAlias = async () => {
		await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me`,{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify({username: newAlias})
		})
		.then(response => {
			if (!response.ok)
				return response;
			else
				window.location.reload();
		})
		.then(data => {if (data !== undefined) Notification(data)});
	}

	const handleChangeAvatar = async () => {
		await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me`,{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify({image_url: newAvatar})
		})
		.then(response => {
			if (!response.ok)
				return response;
			else
				window.location.reload();
		})
		.then(data => {if (data !== undefined) Notification(data)});
	}

	const uploadAvatar = async () => {
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (input == null || input.files == null)
			return;
		const file = input.files[0];
		const formData = new FormData();
		formData.append('file', file, file.name);
		await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me/picture`,{
			headers: {
					'Accept': 'application/json',
				},
			method: 'POST',
			credentials: 'include',
			body: formData
		})
		.then(response => {
			if (!response.ok)
				return response;
			else
				window.location.reload();
		})
		.then(data => {if (data !== undefined) Notification(data)});
	}

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
								<div>
									<SettingsTextField
										label="New avatar"
										InputLabelProps={{
										sx:{
											color:"white",
										}
										}}
										variant="outlined"
										sx={{ input: { color: 'grey' } }}
										id="validation-outlined-input"
										onChange={handleInputAvatar}
									/>
								</div>
								<div className='example'>
									*.jpg or *.png or *.gif
								</div>
								<div>
									<SettingsButton variant="contained" disableRipple onClick={
										handleChangeAvatar
									}>Change Avatar</SettingsButton>
								</div>
								<div>
									<form>
										<div className='Settings-container-div-lvl4'>
											<label>Select a picture to upload</label>
											<input type="file"></input>
											<SettingsButton variant="contained" disableRipple onClick={
												uploadAvatar
											}>upload</SettingsButton>
										</div>
									</form>
								</div>
							</div>
							
							
						</div>
					</div>
					<div className='Settings-container-div-lvl2'>
						<h2>Your alias</h2>
						<div className='Settings-container-div-lvl3'>
							<div className='Settings-container-div-lvl4'>
								{data?.username}
							</div>
							<div className='Settings-container-div-lvl4'>
								<div>
									<SettingsTextField
										label="New alias"
										InputLabelProps={{
											sx:{
												color:"white",
											}
										}}
										variant="outlined"
										sx={{ input: { color: 'grey' } }}
										id="validation-outlined-input"
										onChange={handleInputAlias}
									/>
								</div>
								<div className='example'>
									ex: Toto
								</div>
							</div>
							<div className='Settings-container-div-lvl4'>
								<SettingsButton variant="contained" disableRipple onClick={
									handleChangeAlias
								}>Change Alias</SettingsButton>
							</div>
							
						</div>
					</div>
					<div className='Settings-container-div-lvl2'>
						<h2>2FA - Two Factor Authentication</h2>
						<div className='Settings-container-div-lvl3'>
							<ActivateOrDesactivate2FAButton />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export function SettingsZone(){
	const [me, setMe] = useState<Boolean>(false);

	useEffect(() => {
		const api = async () => {
			await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/isconnected`, {
				method: "GET",
				credentials: 'include'
			})
			.then((response) => {
				if (!response.ok)
					setMe(false);
				else
					setMe(true);
			});
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
