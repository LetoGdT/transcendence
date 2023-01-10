import './App.css'
import './Settings.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from "react";

import { PleaseConnect } from './adaptable-zone';

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
			const data = await fetch("http://localhost:9999/api/users/me", {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);
		};
	
		api();
	}, []);

	const handleDesactivate2FA = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('http://localhost:9999/api/2fa/disable',{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
		});
	}

	if(data?.enabled2fa === true){
		return(
			<div className='Settings-container-div-lvl4'>
				<Link to={"/activate2fa"}>
					<SettingsButton2 variant="contained" disableRipple onClick={
						handleDesactivate2FA
					}>Desactivate</SettingsButton2>
				</Link>
            </div>
		);
	} else {
		return(
			<div className='Settings-container-div-lvl4'>
				<Link to={"/activate2fa"}>
					<SettingsButton variant="contained" disableRipple >Activate</SettingsButton>
				</Link>
            </div>
		);
	}
}

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
	};

	const handleInputAlias = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewAlias(e.target.value);
	};

	const handleChangeAlias = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('http://localhost:9999/api/users/me',{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify({username: newAlias})
		});
	}

	const handleChangeAvatar = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('http://localhost:9999/api/users/me',{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify({image_url: newAvatar})
		});
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
							<div className='Settings-container-div-lvl4'>
								<SettingsButton variant="contained" disableRipple onClick={
									handleChangeAvatar
								}>Change Avatar</SettingsButton>
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
							<div>
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