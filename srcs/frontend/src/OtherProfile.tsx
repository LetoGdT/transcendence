import './App.css'
import './Profile.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import MessageAchievement from './message_achievement.png';
import FriendAchievement from './friend_achievement.png';
import GameAchievement from './game_achievement.png';

import { NotFound } from './adaptable-zone';

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

type friendProps = {
	data: [];
};

type blockedProps = {

};

type statsProps = {
	wins: number;
	losses: number;
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

function AddOrRemoveButton(uid: string | undefined){

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
	};

	const handleClickRemove = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let urltofetch : string;
		urltofetch = 'http://localhost:9999/api/users/me/friends/' + uid;
		const response = await fetch(urltofetch, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE',
			credentials: 'include',
		});
	};

	const [friend, setFriend] = useState<friendProps>();
	// const [blocked, setBlocked] = useState<blockedProps>();

	useEffect(() => {
		const api = async () => {
			const friend = await fetch("http://localhost:9999/api/users/me/friends/", {
				method: "GET",
				credentials: 'include'
			});
			const jsonFriend = await friend.json();
			setFriend(jsonFriend);
			// const blocked = await fetch("http://localhost:9999/api/users/me/banlist/", {
			// 	method: "GET",
			// 	credentials: 'include'
			// });
			// const jsonBlocked = await blocked.json();
			// setBlocked(jsonBlocked);
			// console.log(jsonBlocked);
		};
	
		api();
	}, []);

	const res1 = friend?.data.find(({ id }) => id === uid);
	// const res2 = blocked?.find(({id}) => id === uid);
	// console.log(blocked);

	if (typeof res1 === "undefined"){
		return(
			<AddButton variant="contained" disableRipple onClick={handleClickInvite}>Add to Friends</AddButton>
		);
	}
	else {
		return(
			<RemoveButton variant="contained" disableRipple onClick={handleClickRemove}>Remove from Friends</RemoveButton>
		);
	}
}

export function OtherProfile(){
	let { uid } = useParams();

	const handleClickBlock = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('http://localhost:9999/api/users/me/banlist', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ id: uid })
		});
		// console.log(response.json());//
	};

	const handleClickUnblock = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let urltofetch : string;
		urltofetch = 'http://localhost:9999/api/users/me/banlist/' + uid;
		// console.log(urltofetch);//
		const response = await fetch(urltofetch, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE',
			credentials: 'include',
		});
	};

	const [data, setResult] = useState<resultProps>();
	const [blocked, setBlocked] = useState<blockedProps>();
	const [stats, setStats] = useState<statsProps>();
	
	useEffect(() => {
		const api = async () => {
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users/${uid}`;
			// console.log(urltofetch);//
			const data = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);
			// console.log(jsonData);//

			const blocked = await fetch("http://localhost:9999/api/users/me/banlist/", {
				method: "GET",
				credentials: 'include'
			});
			const jsonBlocked = await blocked.json();
			setBlocked(jsonBlocked);

			const stats = await fetch("http://localhost:9999/api/matches/2/winrate", {
				method: "GET",
				credentials: 'include'
			});
			const jsonStats = await stats.json();
			setStats(jsonStats);
			console.log(jsonStats);
		};
	
		api();
	}, []);

	const options = {
		title: "Your matches' results",
		backgroundColor: 'black',
		colors: ['#009900', '#cc0000', '#646464'],
		legend: {textStyle: {color: 'gray', fontSize: '15'}}
	};

	const gameData = [
		["Result", "nb"],
		["Victories", stats?.wins],
		["Defeats", stats?.losses],
	];

	return(
		<React.Fragment>
			<h1>Profile - Stats</h1>
			<div className='Profile-container'>
				<div className='Profile-Alias'>
					<div className='Profile-Alias-div'>{data?.username}</div>
					<div className='Profile-Alias-div'>{AddOrRemoveButton(uid)}</div>
					<div className='Profile-Alias-div'><BlockButton variant="contained" disableRipple onClick={handleClickBlock}>Block user</BlockButton></div>
					<div className='Profile-Alias-div'><UnblockButton variant="contained" disableRipple onClick={handleClickUnblock}>Unblock user</UnblockButton></div>
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