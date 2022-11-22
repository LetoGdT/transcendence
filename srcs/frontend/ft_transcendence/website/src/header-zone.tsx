import './App.css'

import * as React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

function AvatarZone(){
	let isLogIn: boolean = false;
	if (isLogIn === false){
		return(
			<React.Fragment>
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
			</React.Fragment>
		);
	}
	else {
		return(
			<React.Fragment>
				<Stack
					direction="column"
					justifyContent="center"
					spacing={0.5}
					>
					recup avatar
					<Button variant="text" size='small'>Log Out</Button>

				</Stack>
			</React.Fragment>
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
				<AvatarZone />
			</div>
		</div>
	);
}
