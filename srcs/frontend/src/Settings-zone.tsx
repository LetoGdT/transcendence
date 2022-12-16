import './App.css'
import './Settings.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Avatar from './link_botw_avatar.jpg';//a enlever quand plus nec
import OffLine from './offline.png';
import OnLine from './online.png';
import InGame from './ingame.png';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";

import { PleaseConnect } from './adaptable-zone';

type resultProps = {
	email: string;
	username: string;
	image_url: string;
	rank: number;
	level: number;
	achievement: string[];//?
	//map avec par exemple id = nom de l'achievement, value = url d'une image
	winNb: number;
	loseNb: number;
	drawNb:number;
	friends: string[];//?
	//une map pour ses friends (key = id du friend, value = structure similaire du friend)
	matchHistory: string[];//?
	/*
		il me faudrait une liste avec :
			score du player
			pseudo de l'adversaire
			si l'adversaire est un friend
			score de l'adversaire
		une autre (???) avec :
			niveau fait ?
			reussite ? score ?
		*/
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

export function Settings(){
	const [data, setResult] = useState<resultProps>();

	useEffect(() => {
		const api = async () => {
		  const data = await fetch("http://localhost:9999/api/users/me", {
			method: "GET",
			credentials: 'include'
		  });
		  const jsonData = await data.json();
		  setResult(jsonData);
		  console.log(jsonData);
		};
	
		api();
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
										/>
								</Box>
							</div>
							<div className='Settings-container-div-lvl4'>
								<SettingsButton variant="contained" disableRipple>Browse</SettingsButton>
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
									/>
								</Box>
							</div>
						</div>
					</div>
					<div className='Settings-container-div-lvl2'>
						<h2>2FA - 2 Fractor Authentification</h2>
						<div className='Settings-container-div-lvl3'>
							<div className='Settings-container-div-lvl4'>
								<Stack direction="row" spacing={1} alignItems="center">
									<Typography color="common.white">Off</Typography>
										<TwoFASwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
									<Typography color="common.white">On</Typography>
								</Stack>
							</div>
						</div>
					</div>
						
				</div>
				<div>
					<SettingsButton variant="contained" disableRipple>Validate change(s)</SettingsButton>
				</div>
				*Fill in the field is not required.
			</div>
		</React.Fragment>
	);
}

export function SettingsZone(){
	// const isLoggedIn = props.isLoggedIn;
	// if (isLoggedIn){
		return (
			<Settings />
		);
	// }
	// else 
	// {
	// 	return (
	// 		<PleaseConnect />
	// 	);
	// }
}