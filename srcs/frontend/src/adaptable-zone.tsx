import './App.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import Avatar from './link_botw_avatar.jpg';

import OffLine from './offline.png';
import OnLine from './online.png';
import InGame from './ingame.png';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { Chart } from "react-google-charts";
import { response } from 'express';

import { useState, useEffect } from "react";

export function Friends(){
	return(
		<React.Fragment>
			<h1>Friends</h1>
			<div className='Friend-container'>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 1'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div  className='Friend-Name-status'>
							<div><img src={OnLine} alt={'Online'}></img></div>
							<div className='Friend-name'>Amigo 1</div>
						</div>
					</div>
				</Link>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 2'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div  className='Friend-Name-status'>
							<div><img src={OffLine} alt={'Offline'}></img></div>
							<div className='Friend-name'>Amigo 2</div>
						</div>
					</div>
				</Link>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 2'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div className='Friend-Name-status'>
							<div><img src={InGame} alt={'In Game'}></img></div>
							<div className='Friend-name'>Amigo 3</div>
						</div>
					</div>
				</Link>
			</div>
		</React.Fragment>
	);
}

/*
	il me faudrait une structure avec :
	le pseudo du proprio du compte
	le lien vers son avatar
	une map pour ses friends (key = id du friend, value = structure similaire du friend)
	la liste des matchs
	+
	toute autres info que le proprio pourrait voulair modifier ou qu'on pourrait montrer
*/

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

/*
	il me faudrait une liste avec :
		score du player
		pseudo de l'adversaire
		si l'adversaire est un friend
		score de l'adversaire
	une autre (???) avec :
		niveau fait
		reussite ? score ?
*/

export function MatchHistory(){
	return(
		<React.Fragment>
			<h1>Your Matchs History</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<div className='Match-container'>
				<div className='Match-container-div'>
					<div className='Match-Resultat'>
						Victory
					</div>
					<div className='Match-Summary'>
						<div className='Match-Player-score'>
							<div>You</div>
							<div className='Match-Player-points'>7</div>
						</div>
						<div className='Match-VS'>
							VS
						</div>
						<div className='Match-Player-score'>
							<div>Opponent</div>
							<div className='Match-Player-points'>5</div>
						</div>
					</div>
				</div>
				<div className='Match-container-div'>
					<div className='Match-Resultat'>
						Defeat
					</div>
					<div className='Match-Summary'>
						<div className='Match-Player-score'>
							<div>You</div>
							<div className='Match-Player-points'>7</div>
						</div>
						<div className='Match-VS'>
							VS
						</div>
						<div className='Match-Player-score'>
							<div>Opponent</div>
							<div className='Match-Player-points'>8</div>
						</div>
					</div>
				</div>
				<div className='Match-container-div'>
					<div className='Match-Resultat'>
						Draw
					</div>
					<div className='Match-Summary'>
						<div className='Match-Player-score'>
							<div>You</div>
							<div className='Match-Player-points'>5</div>
						</div>
						<div className='Match-VS'>
							VS
						</div>
						<div className='Match-Player-score'>
							<div>Opponent</div>
							<div className='Match-Player-points'>5</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export function Play(){
	return(
		<div>
			Play
		</div>
	);
}

const SettingsTextField = styled(TextField)({
	'& input:valid + fieldset': {
		borderColor: 'white',
		borderWidth: 2,
	},
	'& input:invalid + fieldset': {
		borderColor: 'red',
		borderWidth: 2,
	},
	'& input:valid:focus + fieldset': {
		borderLeftWidth: 6,
		padding: '4px !important', // override inline-style
	},
});

const SettingsButton = styled(Button)({
	boxShadow: 'none',
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

const TwoFASwitch = styled(Switch)(({ theme }) => ({
	width: 28,
	height: 16,
	padding: 0,
	display: 'flex', '&:active': {
		'& .MuiSwitch-thumb': {
			width: 15,
		},
		'& .MuiSwitch-switchBase.Mui-checked': {
			transform: 'translateX(9px)',
		},
	},
	'& .MuiSwitch-switchBase': {
		padding: 2,
		'&.Mui-checked': {
			transform: 'translateX(12px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: theme.palette.mode === 'dark' ? '#177d00' : '#189000',
			},
		},
	},
	'& .MuiSwitch-thumb': {
		boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
		width: 12,
		height: 12,
		borderRadius: 6,
		transition: theme.transitions.create(['width'], {
			duration: 200,
		}),
	},
	'& .MuiSwitch-track': {
		borderRadius: 16 / 2,
		opacity: 1,
		backgroundColor: 'rgba(187,29,3,1)',
		boxSizing: 'border-box',
	},
}));

export function Settings(){
	return(
		<React.Fragment>
			<h1>Settings</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<div className='Settings-container'>
				<div className='Settings-container-div-lvl1'>
					<div className='Settings-container-div-lvl2'>
						<h2>Your avatar</h2>
						<div className='Settings-container-div-lvl3'>
							<div className='Settings-container-div-lvl4'>
								<img src={Avatar} alt='your avatar' className='Settings-avatar-img'></img>
							</div>
							<div className='Settings-container-div-lvl4'>
								<Box
									component="form"
									noValidate
									sx={{
										display: 'grid',
										gap: 2,
									}}
								>
									<SettingsTextField
										label="New avatar"
										InputLabelProps={{
										sx:{
											color:"white",
										}
										}}
										variant="outlined"
										defaultValue="*.jpg or *.png"
										sx={{ input: { color: 'grey' } }}
										id="validation-outlined-input"
										/>
								</Box>
							</div>
							<div className='Settings-container-div-lvl4'>
								<SettingsButton variant="contained" disableRipple>Browse</SettingsButton>
							</div>
						</div>
					</div>
					<div className='Settings-container-div-lvl2'>
						<h2>Your alias</h2>
						<div className='Settings-container-div-lvl3'>
							<div className='Settings-container-div-lvl4'>
								User's alias
							</div>
							<div className='Settings-container-div-lvl4'>
							<Box
									component="form"
									noValidate
									sx={{
										display: 'grid',
										gap: 2,
									}}
								>
									<SettingsTextField
										label="New alias"
										InputLabelProps={{
										sx:{
											color:"white",
										}
										}}
										variant="outlined"
										defaultValue="ex: Toto"
										sx={{ input: { color: 'grey' } }}
										id="validation-outlined-input"
									/>
								</Box>
							</div>
						</div>
					</div>
					<div className='Settings-container-div-lvl2'>
						<h2>2FA - 2 Fractor Authentification</h2>
						<div className='Settings-container-div-lvl3'>
							<div className='Settings-container-div-lvl4'>
								<Stack direction="row" spacing={1} alignItems="center">
									<Typography color="common.white">Off</Typography>
										<TwoFASwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
									<Typography color="common.white">On</Typography>
								</Stack>
							</div>
						</div>
					</div>
						
				</div>
				<div>
					<SettingsButton variant="contained" disableRipple>Validate change(s)</SettingsButton>
				</div>
				*Fill in the field is not required.
			</div>
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

const AddButton = styled(Button)({
	boxShadow: 'none',
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

const RemoveButton = styled(Button)({
	boxShadow: 'none',
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

export const data = [
	["Result", "nb"],
	["Victories", 11],
	["Defeats", 5],
	["Draws", 2],
];
  
export const options = {
	title: "Your matches' results",
	backgroundColor: 'black',
	colors: ['#009900', '#cc0000', '#646464'],
	legend: {textStyle: {color: 'gray', fontSize: '15'}}
};

export function Profile(){
	return(
		<React.Fragment>
			<h1>Profile - Stats (du user ou d'un friends)</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<p>si on a cliqué sur l'avatar ou le pseudo de quelqu'un d'autre, ça affiche le profile de cette personne</p>
			<div className='Profile-container'>
				<div className='Profile-Alias'>
					<div className='Profile-Alias-div'>Alias</div>
					<div className='Profile-Alias-div'><AddButton variant="contained" disableRipple>Add to Friends</AddButton></div>
					<div className='Profile-Alias-div'><RemoveButton variant="contained" disableRipple>Remove from Friends</RemoveButton></div>
				</div>
				<div className='Profile-container-row-lvl1'>
					<div className='Profile-Avatar'>
						<img src={Avatar} alt="alias' avatar" className='Settings-avatar-img'></img>
					</div>
					<div className='Profile-Pie-Charts'>
						<Chart
							chartType="PieChart"
							data={data}
							options={options}
							width={"100%"}
							height={"400"}
						/>
					</div>
				</div>
				<div>
					<div className='Profile-game-info'>
						<div><b>Rank:</b> Silver</div>
						<div><b>Level:</b> 10</div>
					</div>
					<h4>Achievements</h4>
					<div className='Profile-achievement-container'>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={Avatar} alt='achievement 1' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								Achivement 1
							</div>
						</div>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={Avatar} alt='achievement 2' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								Achivement 2
							</div>
						</div>
					</div>

				</div>
			</div>
		</React.Fragment>
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

// var users: any;

// export function Test(){
// 	fetch("http://localhost:9999/api/users", { credentials: 'include' })
// 	.then(response => {response.text()})//original
// 	// .then(response => {response.json()})
// 	.then(response => console.log(response))//original
// 	// .then(json => console.log(json))
// 	.catch(error => console.log("Erreur : " + error));
// 	return(
// 		<div><h1>Test</h1>
// 		</div>
// 	);
// }

<<<<<<< HEAD:srcs/frontend/ft_transcendence/website/src/adaptable-zone.tsx
//export class Test extends React.Component {
//
//	// Constructor 
//	constructor(props: any) {
//		super(props);
//
//		this.state = {
//			items: [],
//			DataisLoaded: false
//		};
//	}
//
//	// ComponentDidMount is used to
//	// execute the code 
//	componentDidMount() {
//		fetch(
//"http://localhost:9999/api/users")
//			.then((res) => res.json())
//			.then((json) => {
//				this.setState({
//					items: json,
//					DataisLoaded: true
//				});
//			})
//	}
//	render() {
//		const { DataisLoaded, items } = this.state;
//		if (!DataisLoaded) return <div>
//			<h1> Pleses wait some time.... </h1> </div> ;
//
//		return (
//			<div className = "App">
//				<h1> Fetch data from an api in react </h1>  {
//					items.map((item: any) => (
//						<ol key = { item.id } >
//							User_Name: { item.username },
//							User_Email: { item.email }
//						</ol>
//					))
//				}
//			</div>
//		);
//	}
//}
=======
// type resultProps = {
// 	email: string;
// 	username: string;
// };

// export function Test() {
// 	const [data, setResult] = useState<resultProps[]>([]);

// 	useEffect(() => {
// 		const api = async () => {
// 			const data = await fetch("http://localhost:9999/api/users", {
// 				method: "GET"
// 			});
// 			const jsonData = await data.json();
// 			setResult(jsonData.data);
// 		};

// 		api();
// 	}, []);

// 	return (
// 		<div className="App">
// 			<h1>
// 				{data.map((value) => {
// 					return (
// 						<div>
// 							<div>{value.email}</div>
// 							<div>{value.username}</div>
// 						</div>
// 					);
// 		 		 })}
// 			</h1>
// 			<h2>Start editing to see some magic happen!</h2>
// 		</div>
// 	);
// }

// export type TApiResponse = {
// 	status: Number;
// 	statusText: String;
// 	data: any;
// 	error: any;
// 	loading: Boolean;
// };

// export const useApiGet = (url: string): TApiResponse => {
// 	const [status, setStatus] = useState<Number>(0);//init pour eviter une erreur
// 	const [statusText, setStatusText] = useState<String>('');//idem
// 	const [data, setData] = useState<any>();
// 	const [error, setError] = useState<any>();
// 	const [loading, setLoading] = useState<boolean>(false);

// 	const getAPIData = async () => {
// 		setLoading(true);
// 		try {
// 			const apiResponse = await fetch(url);
// 			const json = await apiResponse.json();
// 			setStatus(apiResponse.status);
// 			setStatusText(apiResponse.statusText);
// 			setData(json);
// 		} catch (error) {
// 			setError(error);
// 		}
// 		setLoading(false);
// 	};

// 	useEffect(() => {
// 		getAPIData();
// 	}, []);

// 	return { status, statusText, data, error, loading };
// };

// export function Test() {


// 	// call to the hook
// 	const res: TApiResponse = useApiGet(
// 	  'http://localhost:9999/api/users'
// 	);
  
// 	// print the output
// 	if (!res.loading) console.log(res);

// 	return (
// 		{if (res.loading) {
// 			return(<div>true</div>);
// 		}}
// 	);
//   }
>>>>>>> main:srcs/frontend/src/adaptable-zone.tsx
