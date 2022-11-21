import './App.css'
import './Header.css'
import * as React from 'react';

import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import Banniere from './link_botw_banniere.jpg';
import Avatar from './link_botw_avatar.jpg';

function AvatarZone(){
	let isLogIn: boolean = false;
	if (isLogIn === false){
		return(
			<div className='Avatar-zone'>
				<div className='Avatar-zone-buttons'>
					<div>
						<Link to='/signon'>
							<Button variant="text" size='small'>Sign On</Button>
						</Link>
					</div>
					<div>
						<Button variant="text" size='small'>Log In</Button>
					</div>
				</div>
			</div>
		);
	}
	else 
	{
		return(
			<div className='Avatar-zone'>
				<div className='Avatar-zone-img'>
					<img src={Avatar} alt='avatar' className='Avatar-zone-img'></img>
				</div>
				<div className='Avatar-zone-buttons'>
					<Button variant="text" size='small'>Log Out</Button>
				</div>
			</div>
		);
	}
}

export function OurHeader(){
	return(
		<div className='Header'>
			<div className='Banniere'>
				<img src={Banniere} alt='banniere'></img><img src={Banniere} alt='banniere'></img>
			</div>
			<div>
				<AvatarZone />
			</div>
		</div>
	);
}
