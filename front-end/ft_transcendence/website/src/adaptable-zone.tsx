import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import Avatar from './link_botw_avatar.jpg';

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
				<div className='Friend-container-div'>
					<div>
						<img src={Avatar} alt ='Amigo 1' className='Friend-avatar'></img>
					</div>
					<div>
						Amigo 1
					</div>
				</div>
				<div className='Friend-container-div'>
					<div>
						<img src={Avatar} alt ='Amigo 2' className='Friend-avatar'></img>
					</div>
					<div>
						Amigo 2
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

// export class Friends extends React.Component {
// 	constructor(props: any) {
// 		super(props);
// 		this.state = {
			
// 		};
// 	}
// }

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