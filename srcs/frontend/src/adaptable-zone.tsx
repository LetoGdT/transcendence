import './App.css'
import './Friend.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import { LogInButton, SignUpButton } from './Header-zone';
import { getAllPaginated } from './tools';

type resultProps = {
	data: [];
}

export function Home(){
	const [me, setMe] = React.useState<Boolean>(false);
	const [data, setResult] = React.useState<resultProps[]>([]);

	React.useEffect(() => {
		const api = async () => {
			await fetch("http://localhost:9999/api/users/isconnected", {
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

	React.useEffect(() => {
		const call = async () => {
			await getAllPaginated('users')
			.then(data => setResult(data));
		};
		if (me === true)
			call();
	}, [me]);
	
	const isLoggedIn = me;
	if (isLoggedIn){
		return (
			<React.Fragment>
				<div>
					<h1>Home</h1>
					<p>Bienvenue sur notre projet ft_transcendence.
						<br></br>
						Ce projet a été réalisé par <a href='https://profile.intra.42.fr/users/tlafay'>tlafay</a>, <a href='https://profile.intra.42.fr/users/lgaudet-'>lgaudet-</a> et <a href='https://profile.intra.42.fr/users/lburnet'>lburnet</a>
						<br></br>
						HF pendant cette correction.
					</p>
				</div>
				<div>
					<h1>List of users</h1>
					<div className='Friend-container'>
						{data.length > 0 && data?.map((user: any) => {
							var url: string = "/otherprofile";
							url = url.concat("/");
							url = url.concat(user.id);
							return(
								<Link to={url} >
									<div className='Friend-container-div'>
										<div>
											<img src={user.image_url} alt={user.username + "'s avatar"} className='Friend-avatar'></img>
										</div>
										<div className='Friend-Name-status'>
											<div className='Friend-name'>{user.username}</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</React.Fragment>
		);
	}
	else 
	{
		return (
			<div>
				<h1>Home</h1>
				<p>Bienvenue sur notre projet ft_transcendence.
					<br></br>
					Ce projet a été réalisé par <a href='https://profile.intra.42.fr/users/tlafay'>tlafay</a>, <a href='https://profile.intra.42.fr/users/lgaudet-'>lgaudet-</a> et <a href='https://profile.intra.42.fr/users/lburnet'>lburnet</a>
					<br></br>
					HF pendant cette correction.
				</p>
			</div>
		 );
	}
}

export function NotFound(){
	return(
		<React.Fragment>
			<h1>Oops! You seem to be lost.</h1>
			<div>This is an error 404</div>
		</React.Fragment>
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
