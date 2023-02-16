import './App.css'
import './Friend.css'
import './Home.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import { LogInButton, SignUpButton } from './Header-zone';
import { getAllPaginated } from './tools';

type resultProps = {
	data: [];
}

function Presentation(){
	return(
		<div>
			<h1>Home</h1>
			<div className='Presentation'>
				<div>
					Bienvenue sur notre projet ft_transcendence.
					<br></br>
					Ce projet a été réalisé par :
					<br></br>
				</div>
				<div className='Presentation-container'>
					<div className='Presentation-container-div'>
						<a href='https://profile.intra.42.fr/users/tlafay'>
							<div>
								<img src="https://cdn.intra.42.fr/users/74354c8527133922edfca5bdfa9e0d74/tlafay.jpg" alt={"tlafay's avatar"} className='Presentation-avatar'></img>
							</div>
							<div className='Presentation-Name-status'>
								<div className='Presentation-name'>tlafay</div>
							</div>
						</a>
					</div>
					<div className='Presentation-container-div'>
						<a href='https://profile.intra.42.fr/users/lburnet'>
							<div>
								<img src="https://cdn.intra.42.fr/users/554ea290ae9a8010d1b07010036acbce/lburnet.jpg" alt={"lburnet's avatar"} className='Presentation-avatar'></img>
							</div>
							<div className='Presentation-Name-status'>
								<div className='Presentation-name'>lburnet</div>
							</div>
						</a>
					</div>
					<div className='Presentation-container-div'>
						<a href='https://profile.intra.42.fr/users/lgaudet-'>
							<div>
								<img src="https://cdn.intra.42.fr/users/809d99670399b657256668e1e5873a5b/lgaudet-.jpg" alt={"lgaudet-'s avatar"} className='Presentation-avatar'></img>
							</div>
							<div className='Presentation-Name-status'>
								<div className='Presentation-name'>lgaudet-</div>
							</div>
						</a>
					</div>
				</div>
				<div>
					HF pendant cette correction.
				</div>
			</div>
		</div>
	);
}

export function Home(){
	const [me, setMe] = React.useState<Boolean>(false);
	const [data, setResult] = React.useState<resultProps[]>([]);

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
				<Presentation />
				<div>
					<h1>List of users</h1>
					<div className='Friend-container'>
						{data.length > 0 && data?.map((user: any) => {
							var url: string = "/otherprofile";
							url = url.concat("/");
							url = url.concat(user.id);
							return(
								<Link to={url} key={user.id}>
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
let linkToLog : string = `${process.env.REACT_APP_NESTJS_HOSTNAME}/log`;

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
				<a href={linkToLog}>
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
