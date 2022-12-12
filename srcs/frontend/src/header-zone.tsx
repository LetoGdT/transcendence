import './App.css'
import './Header.css'
import * as React from 'react';

// import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import Banniere from './link_botw_banniere.jpg';
import Avatar from './link_botw_avatar.jpg';
import Logo42blanc from './logo_42_white.png';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const LogInButton = styled(Button)({
	boxShadow: 'none',
	width: '100px',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#3b9b3b',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#4a7a4a',
		borderColor: '#646464',
	},
	'&:focus': {
		xShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

const SignOnButton = styled(Button)({
	boxShadow: 'none',
	width: '100px',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#007dd6',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#004d7b',
		borderColor: '#646464',
	},
	'&:focus': {
		adow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

const LogOutButton = styled(Button)({
	boxShadow: 'none',
	width: '100px',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#bb1d03',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#891d03',
		borderColor: '#646464',
	},
	'&:focus': {
		boxShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

function AvatarZone(){
	let isLogIn: boolean = false;
	// if (isLogIn === false){
	// 	return(
	// 		<div className='Avatar-zone'>
	// 			<div className='Avatar-zone-buttons'>
	// 				<div className='Avatar-zone-1button'>
	// 					<Link to='/signon'>
	// 						<SignOnButton variant="contained" disableRipple>Sign On</SignOnButton>
	// 					</Link>
	// 				</div>
	// 				<div className='Avatar-zone-1button'>
	// 					<LogInButton variant="contained" disableRipple>Log In</LogInButton>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }
	// else 
	{
		return(
			<div className='Avatar-zone'>
				<div className='Avatar-zone-img'>
					<img src={Avatar} alt='avatar' className='Avatar-zone-img'></img>
				</div>
				<div className='Avatar-zone-buttons'>
					<LogOutButton variant="contained" disableRipple>Log Out</LogOutButton>
				</div>
			</div>
		);
	}
}

export function OurHeader(){
	return(
		<div className='Header'>
			<div className='Logo'>
				<img src={Logo42blanc} alt='42 logo blanc' className='Logo42'></img>
			</div>
			<div className='Banniere'>
				<img src={Banniere} alt='banniere' className='Banniere-img'></img>
				{/* <img src={Banniere} alt='banniere' className='Banniere-img'></img> */}
			</div>
			<div>
				<AvatarZone />
			</div>
		</div>
	);
}
