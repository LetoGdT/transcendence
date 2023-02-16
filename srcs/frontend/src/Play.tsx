import './Play.css';
import './App.css';
import React from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'
import { PleaseConnect } from "./adaptable-zone";


const NormalModeButton = styled(Button)({
	boxShadow: 'none',
	width: '400px',
	height: '126px',
	textTransform: 'none',
	fontSize: 20,
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

function Play(){
	return(
		<React.Fragment>
			<h1>Play</h1>
			<div className='Play-container'>
				<div className='Play-button'>
					<Link to="/pong">
						<NormalModeButton variant="contained" disableRipple>PLAY<br></br>Classic Mode</NormalModeButton>
					</Link>
				</div>
			</div>
		</React.Fragment>
	);
}

export function PlayZone(){
	const [me, setMe] = React.useState<Boolean>(false);

	React.useEffect(() => {
		const api = async () => {
			await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/isconnected`, {
				method: "GET",
				credentials: 'include'
			})
			.then((response) => {
				if (!response.ok)
					setMe(false);
				else
					setMe(true);
			});
		};
	
		api();
	}, []);
	
	const isLoggedIn = me;
	if (isLoggedIn){
		return (
			<Play />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
			);
	}
}
