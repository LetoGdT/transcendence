import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function AvatarZone(){
	let isLogIn: boolean = false;
	if (isLogIn === false){
		return(
			<Stack 
				direction="column"
				justifyContent="center"
				spacing={0.5}
				>
				<Button variant="text" size='small'>Sign On</Button>
				<Button variant="text" size='small'>Log In</Button>
			</Stack>
		);
	}
	else if (isLogIn === true){
		return(
			<Stack
				direction="column"
				justifyContent="center"
				spacing={0.5}
			>
				recup avatar
				<Button variant="text" size='small'>Log Out</Button>

			</Stack>
		);
	}
}

export function OurHeader(){
	return(
		<div className='Header'>
			<div>
				bannière
			</div>
			<div>
				{/** pourquoi ça marche pas sur ubuntu ???
				<AvatarZone />
				*/}
			</div>
		</div>
	);
}
