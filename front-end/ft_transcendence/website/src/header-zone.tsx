import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export function OurHeader(){
	return(
		<div className='Header'>
			<div>
				bannière
			</div>
			<div>
				<AvatarZone/>
			</div>
		</div>
	);
}

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
	else {
		return(
			<div>a coder</div>
		);
	}
}