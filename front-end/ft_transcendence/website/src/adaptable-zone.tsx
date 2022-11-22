import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import Avatar from './link_botw_avatar.jpg';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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

/*
on affiche :
avatar - modifiable
pseudo - modifiable
activer auth 2FA
*/

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
						mettre un truc pour upload une nouvelle image
						<Box
							component="form"
							sx={{
								"& .MuiTextField-root": { m: 1, width: "25ch" }
							}}
							noValidate
							autoComplete="off"
						>
							<div>
								<TextField
									label="New Avatar"
									id="outlined-size-small"
									defaultValue="Please select a new avatar"
									size="small"
								/>
							</div>
						</Box>
					</div>
				</div>
				<h2>Your Alias</h2>
				<div className='Settings-container-div-lvl1'>
					<div className='Settings-container-div-lvl2'>
						User's Pseudo
					</div>
					<div className='Settings-container-div-lvl2'>
						mettre quelque chose pour changer le pseudo
					</div>
				</div>
				<h2>2FA - 2 Fractor Authentification</h2>
				<div className='Settings-container-div-lvl1'>
					<div className='Settings-container-div-lvl2'>
						Mettre un genre d'interrupteur pour activer ou desactiver le 2FA
					</div>
				</div>
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
		<div className='App'>
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
		<div className='App'>
			To register you need to apply to a 42 campus and valid the piscine. Good luck, have fun.
			<a href="https://admissions.42lyon.fr/users/sign_in">
				<Button variant='text' size='large'>42</Button>			
			</a>
		</div>
	);
}