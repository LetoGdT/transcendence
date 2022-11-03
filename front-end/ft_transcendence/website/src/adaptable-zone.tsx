import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export function Chat(){
	return(
		<div>
			<h1>Chat</h1>
		</div>
	);
}

export function Friends(){
	return(
		<div>
			Friends
			si user non connecter renvoyer vers /pleaseconnect
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
	return(
		<div>
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
		<div>
			<Stack 
				direction="column"
				justifyContent="center"
				spacing={0.5}
				>
				<Button variant="text" size='small'>Sign On</Button>
				<Button variant="text" size='small'>Log In</Button>
			</Stack>
		</div>
	);
}