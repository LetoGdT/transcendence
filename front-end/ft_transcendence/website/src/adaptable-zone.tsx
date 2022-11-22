import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import Avatar from './link_botw_avatar.jpg';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

export function Chat(){
	return(
		<div>
			<h1>Chat</h1>
		</div>
	);
}

export function Friends(){
	return(
		<React.Fragment>
			<h1>Friends</h1>
			<div className='Friend-container'>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 1'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div>
							Amigo 1
						</div>
					</div>
				</Link>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 2'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div>
							Amigo 2
						</div>
					</div>
				</Link>
			</div>
		</React.Fragment>
	);
}

/*
	il me faudrait une structure avec :
	le pseudo du proprio du compte
	le lien vers son avatar
	une map pour ses friends (key = id du friend, value = structure similaire du friend)
	la liste des matchs
	+
	toute autres info que le proprio pourrait voulair modifier ou qu'on pourrait montrer
*/

/*
export class Friends extends React.Component {
	constructor(props: any) {
		super(props);
		this.state = {
			
		};
	}

	render() {
		
	const friends = ((id) => {
		return (
			<div className='Friend-container-div'>
				 <div>
					 <img src={Avatar} alt ={'???'+'\'s avatar'} className='Friend-avatar'></img>
				 </div>
				 <div>
					 ???
				 </div>
			 </div>
		);
	})
			
		return(
			<React.Fragment>
				<h1>Friends</h1>
				<div className='Friend-container'>
					{friends}
				</div>
			</React.Fragment>
		);
	}
}
*/

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

/*
	il me faudrait une liste avec :
		score du player
		pseudo de l'adversaire
		si l'adversaire est un friend
		score de l'adversaire
	une autre (???) avec :
		niveau fait
		reussite ? score ?
*/

export function MatchHistory(){
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
	return(
		<React.Fragment>
			<h1>Settings</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<div className='Settings-container'>
				<h2>Your avatar</h2>
				<div className='Settings-container-div-lvl1'>
					<div className='Settings-container-div-lvl2'>
						<img src={Avatar} alt='your avatar' className='Settings-avatar-img'></img>
					</div>
					<div className='Settings-container-div-lvl2'>
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
								required
								variant="outlined"
								defaultValue="*.jpg or *.png"
								sx={{ input: { color: 'grey' } }}
								id="validation-outlined-input"
							/>
						</Box>
					</div>
					<div className='Settings-container-div-lvl2'>
						<SettingsButton variant="contained" disableRipple>Browse</SettingsButton>
					</div>
				</div>
				<h2>Your alias</h2>
				<div className='Settings-container-div-lvl1'>
					<div className='Settings-container-div-lvl2'>
						User's alias
					</div>
					<div className='Settings-container-div-lvl2'>
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
								required
								variant="outlined"
								defaultValue="ex: Toto"
								sx={{ input: { color: 'grey' } }}
								id="validation-outlined-input"
							/>
						</Box>
					</div>
				</div>
				<h2>2FA - 2 Fractor Authentification</h2>
				<div className='Settings-container-div-lvl1'>
					<div className='Settings-container-div-lvl2'>
						<Stack direction="row" spacing={1} alignItems="center">
							<Typography color="common.white">Off</Typography>
								<TwoFASwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
							<Typography color="common.white">On</Typography>
						</Stack>
					</div>
				</div>
				<div className='Settings-container-div-lvl1'>
					<SettingsButton variant="contained" disableRipple>Validate change(s)</SettingsButton>
				</div>
					*Fill in the field is not required
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

/*
	avatar, pseudo
	stats : -> petit graph circulaire ?
		nombre de victoire
		nombre de defaites
		nombre de draw ?
		rang, niveaux
		hauts faits
		si c'est la page d'un autre : bouton ajouter/retirer ami
*/

export function Profile(){
	return(
		<div>
			<h1>Profile - Stats (du user ou d'un friends)</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<p>si on a cliqué sur l'avatar ou le pseudo de quelqu'un d'autre, ça affiche le profile de cette personne</p>
		</div>
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