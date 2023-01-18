import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import { LogInButton, SignUpButton } from './Header-zone';

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

export function NotFound(){
	return(
		<React.Fragment>
			<h1>Oops! You seem to be lost.</h1>
			<div>This is an error 404</div>
		</React.Fragment>
	);
}

export function Play(){
	return(
		<div className='Pong'>
			Play {/* TODO syl : here is pong's place */}
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

export function PleaseConnect(){
	return(
		<div className='Default'>
			You have not logged in yet please connect or register.
			<Stack 
				direction="column"
				justifyContent="center"
				spacing={0.5}
			>
				<Link to='/signup'>
					<SignUpButton variant="contained" disableRipple>Sign Up</SignUpButton>
				</Link>
				<a href='http://localhost:9999/log'>
					<LogInButton variant="contained" disableRipple>Log In</LogInButton>
				</a>
			</Stack>
		</div>
	);
}

export function SignUp(){
	return(
		<div className='Default'>
			To register you need to apply to a 42 campus and valid the piscine. Good luck, have fun.
			<a href="https://admissions.42lyon.fr/users/sign_in">
				<Button variant='text' size='large'>42</Button>			
			</a>
		</div>
	);
}
