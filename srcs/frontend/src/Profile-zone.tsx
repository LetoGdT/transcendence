import './App.css'
import './Profile.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import Avatar from './link_botw_avatar.jpg';//a enlever quand plus nec
import { styled } from '@mui/material/styles';
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import MessageAchievement from './message_achievement.png';
import FriendAchievement from './friend_achievement.png';
import GameAchievement from './game_achievement.png';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import { PleaseConnect } from './adaptable-zone';

type resultProps = {
	email: string;
	username: string;
	image_url: string;
	status: string;
	rank: number;
	level: number;
	achievement: [];//?
	//map avec par exemple id = nom de l'achievement, value = url d'une image
	wins: number;
	losses: number;
};


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

const BlockButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#bb1d03',
	borderColor: '#646464',
	color: '#000000',
	fontWeight: 'bold',
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
		backgroundColor: '#000000',
		color: '#bb1d03',
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

const UnblockButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#3b9b3b',
	borderColor: '#646464',
	color: '#000000',
	fontWeight: 'bold',
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
		backgroundColor: '#ffffff',
		borderColor: '#646464',
		color: '#3b9b3b',
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

export const options = {
	title: "Your matches' results",
	backgroundColor: 'black',
	colors: ['#009900', '#cc0000', '#646464'],
	legend: {textStyle: {color: 'gray', fontSize: '15'}}
};

export const gameData = [
	["Result", "nb"],
	// ["Victories", {data?.winNb}],
	// ["Defeats", {data?.loseNb}],

	["Victories", 15],
	["Defeats", 2],
];


// export function OtherProfile(Info:{uid:number}){
// 	const uid = Info.uid;
export function OtherProfile(){
	let { uid } = useParams();
	const handleClickInvite = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('http://localhost:9999/api/users/me/friends/invites', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ id: uid })
		});
		console.log(response.json());//
	};

	const [data, setResult] = useState<resultProps>();
	
	useEffect(() => {
		const api = async () => {
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users/${uid}`;
			console.log(urltofetch);//
			const data = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);
			console.log(jsonData);//
		};
	
		api();
	}, []);
	return(
		<React.Fragment>
			<h1>Profile - Stats</h1>
			<div className='Profile-container'>
				<div className='Profile-Alias'>
					<div className='Profile-Alias-div'>{data?.username}</div>
					{/* <div>{data?.email}</div> */}
					<div className='Profile-Alias-div'><AddButton variant="contained" disableRipple onClick={handleClickInvite}>Add to Friends</AddButton></div>
					<div className='Profile-Alias-div'><RemoveButton variant="contained" disableRipple>Remove from Friends</RemoveButton></div>
					<div className='Profile-Alias-div'><BlockButton variant="contained" disableRipple>Block user</BlockButton></div>
					<div className='Profile-Alias-div'><UnblockButton variant="contained" disableRipple>Unblock user</UnblockButton></div>
				</div>
				<div className='Profile-container-row-lvl1'>
					<div className='Profile-Avatar'>
						<img src={data?.image_url} alt="alias' avatar" className='Profile-avatar-img'></img>
					</div>
					<div className='Profile-Pie-Charts'>
						<Chart
							chartType="PieChart"
							data={gameData}
							options={options}
							width={"100%"}
							height={"400"}
						/>
					</div>
				</div>
				<div>
					<div className='Profile-game-info'>
						<div><b>Rank:</b> {data?.rank}</div>
						<div><b>Level:</b> {data?.level}</div>
					</div>
					<h4>Achievements</h4>
					<div className='Profile-achievement-container'>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={MessageAchievement} alt='1 sent in chat' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								1st message sent
							</div>
						</div>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={FriendAchievement} alt='1 friend made' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								1st friend get
							</div>
						</div>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={GameAchievement} alt='1 game played' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								1st game played
							</div>
						</div>
					</div>

				</div>
			</div>
		</React.Fragment>
	);
}

type invitesProps = {
	invites: string[];
};

export function Profile(){
	const [data, setResult] = useState<resultProps>();
	const [invites, setInvites] = useState<invitesProps>();
	var uid: number = 1;//à mettre à 0

	useEffect(() => {
		const api = async () => {
		  const data = await fetch("http://localhost:9999/api/users/me", {
			method: "GET",
			credentials: 'include'
		  });
		  const jsonData = await data.json();
		  setResult(jsonData);
		  console.log(jsonData);//
		  const invites = await fetch("http://localhost:9999/api/users/me/friends/invites", {
		  	method: "GET",
			credentials: 'include'
		  });
		  const jsonInvites = await invites.json();
		  setInvites(jsonInvites);
		  console.log(jsonInvites);//
		};
	
		api();
	}, []);

	const handleClickAccept = async () => {
		const response = await fetch('http://localhost:9999/api/users/me/friends', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ id: uid })
		});
		console.log(response.json());//
	};

	const handleClickReject = async () => {
		let urltofetch : string;
		urltofetch = 'http://localhost:9999/api/users/me/friends/invitations/' + uid;
		console.log(urltofetch);//
		const response = await fetch(urltofetch, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE',
			credentials: 'include',
		});
		console.log(response.json());//
	};

	return(
		<React.Fragment>
			<h1>Profile - Stats</h1>
			<div className='Profile-container'>
				<div className='Profile-Alias'>
					<div className='Profile-Alias-div'>{data?.username}</div>
				</div>
				<div className='Profile-container-row-lvl1'>
					<div className='Profile-Avatar'>
						<img src={data?.image_url} alt="alias' avatar" className='Profile-avatar-img'></img>
					</div>
					<div className='Profile-Pie-Charts'>
						<Chart
							chartType="PieChart"
							data={gameData}
							options={options}
							width={"100%"}
							height={"400"}
						/>
					</div>
				</div>
				<div>
					<div className='Profile-game-info'>
						<div><b>Rank:</b> {data?.rank}</div>
						<div><b>Level:</b> {data?.level}</div>
					</div>
					<h4>Achievements</h4>
					<div className='Profile-achievement-container'>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={MessageAchievement} alt='1 sent in chat' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								1st message sent
							</div>
						</div>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={FriendAchievement} alt='1 friend made' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								1st friend get
							</div>
						</div>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={GameAchievement} alt='1 game played' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								1st game played
							</div>
						</div>
					</div>
					<h4>Invitations received</h4>
					<div>
						<div className='Profile-invitation-received'>
							<div>
								<img src={Avatar} alt="user's avatar" className='Profile-invitation-received-img'></img>
							</div>
							<div>user 1</div>
							<div>
								<IconButton color="success" aria-label="accept" onClick={handleClickAccept}>
									<CheckIcon />
								</IconButton>
							</div>
							<div>
								<IconButton color="error" aria-label="reject" onClick={handleClickReject}>
									<CloseIcon />
								</IconButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

type meProps = {
};

export function ProfileZone(){
	const [me, setMe] = useState<meProps>();

	useEffect(() => {
		const api = async () => {
			const data = await fetch("http://localhost:9999/api/users/isconnected", {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setMe(jsonData);
		};
	
		api();
	}, []);
	
	const isLoggedIn = me;
	if (isLoggedIn){
		return (
			<Profile />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		);
	}
}