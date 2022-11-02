import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function OutlinedButtons() {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined">Primary</Button>
      <Button variant="outlined" disabled>
        Disabled
      </Button>
      <Button variant="outlined" href="#outlined-buttons">
        Link
      </Button>
    </Stack>
  );
}

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
				<Button variant="outlined">Log In</Button>
				<Button variant="outlined" href="#outlined-buttons">
					Sign On
				</Button>
			</Stack>
		);
	}
	else {
		return(
			<div>a coder</div>
		);
	}
}