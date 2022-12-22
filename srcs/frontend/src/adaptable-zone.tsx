import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

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

export function Play(){
	return(
		<div>
			Play
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
