import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import Avatar from './link_botw_avatar.jpg';

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

export function Friends(){
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
			<h1>Friends</h1>
			<div className='Friend-container'>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 1'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div  className='Friend-Name-status'>
							<div><img src={OnLine} alt={'Online'}></img></div>
							<div className='Friend-name'>Amigo 1</div>
						</div>
					</div>
				</Link>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 2'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div  className='Friend-Name-status'>
							<div><img src={OffLine} alt={'Offline'}></img></div>
							<div className='Friend-name'>Amigo 2</div>
						</div>
					</div>
				</Link>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 2'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div className='Friend-Name-status'>
							<div><img src={InGame} alt={'In Game'}></img></div>
							<div className='Friend-name'>Amigo 3</div>
						</div>
					</div>
				</Link>
			</div>
		</React.Fragment>
	);
}

export function Home(){
	return(
		<div>
			<h1>Home</h1>
			<p>Ici on peut mettre ce qu'on veut.
				Je verrai bien un resumé de ce que propose ce site, avec le nombre de users enregistrés, le nombre de users connecté en ce moment et le nombre de users en jeu (inclu en attente de match).
			</p>
		</div>
	);
}

export function MatchHistory(){
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
			<h1>Your Matchs History</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<div className='Match-container'>
				<div className='Match-container-div'>
					<div className='Match-Resultat'>
						Victory
					</div>
					<div className='Match-Summary'>
						<div className='Match-Player-score'>
							<div>You</div>
							<div className='Match-Player-points'>7</div>
						</div>
						<div className='Match-VS'>
							VS
						</div>
						<div className='Match-Player-score'>
							<div>Opponent</div>
							<div className='Match-Player-points'>5</div>
						</div>
					</div>
				</div>
				<div className='Match-container-div'>
					<div className='Match-Resultat'>
						Defeat
					</div>
					<div className='Match-Summary'>
						<div className='Match-Player-score'>
							<div>You</div>
							<div className='Match-Player-points'>7</div>
						</div>
						<div className='Match-VS'>
							VS
						</div>
						<div className='Match-Player-score'>
							<div>Opponent</div>
							<div className='Match-Player-points'>8</div>
						</div>
					</div>
				</div>
				<div className='Match-container-div'>
					<div className='Match-Resultat'>
						Draw
					</div>
					<div className='Match-Summary'>
						<div className='Match-Player-score'>
							<div>You</div>
							<div className='Match-Player-points'>5</div>
						</div>
						<div className='Match-VS'>
							VS
						</div>
						<div className='Match-Player-score'>
							<div>Opponent</div>
							<div className='Match-Player-points'>5</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export function Play(){
	return(
		<div>
			Play
		</div>
	);
}

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
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
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

export function SpecAMatch(){
	return(
		<div>
			SpecAMatch
		</div>
	);
}

const AddButton = styled(Button)({
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

const RemoveButton = styled(Button)({
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


export const options = {
	title: "Your matches' results",
	backgroundColor: 'black',
	colors: ['#009900', '#cc0000', '#646464'],
	legend: {textStyle: {color: 'gray', fontSize: '15'}}
};

export const gameData = [
	["Result", "nb"],
	// ["Victories", {data?.winNb}],
	// ["Defeats", {data?.loseNb}],
	// ["Draws", {data?.drawNb}],
	["Victories", 11],
	["Defeats", 5],
	["Draws", 2],
];

export function Profile(){
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
			<h1>Profile - Stats</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<div className='Profile-container'>
				<div className='Profile-Alias'>
					<div className='Profile-Alias-div'>{data?.username}</div>
					{/* <div className='Profile-Alias-div'><AddButton variant="contained" disableRipple>Add to Friends</AddButton></div>
					<div className='Profile-Alias-div'><RemoveButton variant="contained" disableRipple>Remove from Friends</RemoveButton></div> */}
				</div>
				<div className='Profile-container-row-lvl1'>
					<div className='Profile-Avatar'>
						<img src={data?.image_url} alt="alias' avatar" className='Settings-avatar-img'></img>
					</div>
					<div className='Profile-Pie-Charts'>
						<Chart
							chartType="PieChart"
							data={gameData}
							options={options}
							width={"100%"}
							height={"400"}
						/>
					</div>
				</div>
				<div>
					<div className='Profile-game-info'>
						<div><b>Rank:</b> {data?.rank}</div>
						<div><b>Level:</b> {data?.level}</div>
					</div>
					<h4>Achievements</h4>
					<div className='Profile-achievement-container'>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={Avatar} alt='achievement 1' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								Achivement 1
							</div>
						</div>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={Avatar} alt='achievement 2' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								Achivement 2
							</div>
						</div>
					</div>

				</div>
			</div>
		</React.Fragment>
	);
}

export function PleaseConnect(){
	return(
		<div className='Default'>
			You have not logged in yet please connect or register.
			<Stack 
				direction="column"
				justifyContent="center"
				spacing={0.5}
			>
				<Link to='/signon'>
					<Button variant="text" size='small'>Sign On</Button>
				</Link>
				<Button variant="text" size='small'>Log In</Button>
			</Stack>
		</div>
	);
}

export function SignOn(){
	return(
		<div className='Default'>
			To register you need to apply to a 42 campus and valid the piscine. Good luck, have fun.
			<a href="https://admissions.42lyon.fr/users/sign_in">
				<Button variant='text' size='large'>42</Button>			
			</a>
		</div>
	);
}

	