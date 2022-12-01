import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom'

export function Chat(){
	return(
		<div>
			<h1>Chat</h1>
		</div>
	);
}

export function Friends(){
	return(
		<div className='friends'>
			Friends
			si user non connecté renvoyer vers /pleaseconnect
			<div className='a-friend'>
				
				friend 1
			</div>
			<div>
				
				friend 2
			</div>
		</div>
	);
}

export function Home(){
	return(
		<div>
			<h1>Home</h1>
		</div>
	);
}

export function MatchHistory(){
	return(
		<div>
			MatchHistory
			si user non connecter renvoyer vers /pleaseconnect
		</div>
	);
}

export function Play(){
	return(
		<div>
			Play
		</div>
		);
}

export function Profile(){
	fetch("http://localhost:9999/api/users/me", { credentials: 'include' })
	.then(response => response.json())
	.then(response => console.log(response['username']))
	.catch(error => console.log("Erreur : " + error));
	return(
		<div>r
			Profile ou settings
			si user non connecter renvoyer vers /pleaseconnect
		</div>
	);
}

export function SpecAMatch(){
	return(
		<div>
			SpecAMatch
		</div>
	);
}

export function Stats(){
	return(
		<div>
			Stats (du user ou d'un friends)
			si user non connecter renvoyer vers /pleaseconnect
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