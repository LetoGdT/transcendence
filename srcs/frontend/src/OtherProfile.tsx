import './App.css'
import './Profile.css'
import './MatchHistory.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import { NotFound } from './adaptable-zone';
import { FromEXPtoLvl, ToNextLevel } from './tools';
import { OneAchievement } from './Profile-zone';

type resultProps = {
	email: string;
	username: string;
	image_url: string;
	status: string;
	exp: number;
};

type friendProps = {
	data: [];
};

type blockedProps = {
	// data:[]; 
};

type statsProps = {
	wins: number;
	losses: number;
}

type achievementProps = {
	data: [];
}

type opponentProps = {
	username: string;
};

type meProps = {
	username: string;
	id: number;
}

type matchHistoryProps = {
	data: [];
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

	useEffect(() => {
		const api = async () => {
			const friend = await fetch("http://localhost:9999/api/users/me/friends/", {
				method: "GET",
				credentials: 'include'
			});
			const jsonFriend = await friend.json();
			setFriend(jsonFriend);
			
		};
	
		api();
	}, []);

	const res1 = friend?.data.find(({ id }) => id === uid);

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

function BlockOrUnblockButton(uid: string | undefined){

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
	};

	const handleClickUnblock = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let urltofetch : string;
		urltofetch = 'http://localhost:9999/api/users/me/banlist/' + uid;
		const response = await fetch(urltofetch, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE',
			credentials: 'include',
		});
	};

	const [blocked, setBlocked] = useState<blockedProps>();

	useEffect(() => {
		const api = async () => {
			const blocked = await fetch("http://localhost:9999/api/users/me/banlist/", {
				method: "GET",
				credentials: 'include'
			});
			const jsonBlocked = await blocked.json();
			setBlocked(jsonBlocked);
		};
	
		api();
	}, []);


	// console.log(blocked);//
	// const res1 = blocked?.find(({ id }) => id === uid);

	return(<div></div>);
	// if (typeof res1 === "undefined"){
	// 	return(
	// 		<AddButton variant="contained" disableRipple onClick={handleClickBlock}>Block user</AddButton>
	// 	);
	// }
	// else {
	// 	return(
	// 		<RemoveButton variant="contained" disableRipple onClick={handleClickUnblock}>Unblock user</RemoveButton>
	// 	);
	// }
}

function OneMatch(match:any){
	let { uid } = useParams();
	const {user1, user2, score_user1, score_user2, game_type} = match.match;
	const [data1, setResult1] = useState<opponentProps>();
	const [data2, setResult2] = useState<opponentProps>();
	const [me, setMe] = useState<meProps>();

	// console.log(match.match.user1);//

	useEffect(() => {
		const api = async () => {
			let urltofetch1 : string;
			urltofetch1 = `http://localhost:9999/api/users/${user1.id}`;
			const data1 = await fetch(urltofetch1, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData1 = await data1.json();
			setResult1(jsonData1);
			
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users/${user2.id}`;
			const data2 = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data2.json();
			setResult2(jsonData);

			urltofetch = `http://localhost:9999/api/users/${uid}`;
			const me = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			});
			const jsonMe = await me.json();
			setMe(jsonMe);
		};
	
		api();
	}, []);

	if (user1.id === me?.id){
		const result: string = (score_user1 > score_user2) ? "Victory" : "Defeat";
		var url: string = "/otherprofile";
		url = url.concat("/");
		url = url.concat(user2.id.toString());
		return (
			<div className='Match-container-div'>
				{game_type}
				<div className='Match-Resultat'>
					{result}
				</div>
				<div className='Match-Summary'>
					<div className='Match-Player-score'>
						<div>You</div>
						<div className='Match-Player-points'>{score_user1}</div>
					</div>
					<div className='Match-VS'>
						VS
					</div>
					<div className='Match-Player-score'>
						<div>
							<Link to={url} >
								{data2?.username}
							</Link>
						</div>
						<div className='Match-Player-points'>{score_user2}</div>
					</div>
				</div>
			</div>
			
		);
	} else {
		const result: string = (score_user2 > score_user1) ? "Victory" : "Defeat";
		var url: string = "/otherprofile";
		url = url.concat("/");
		url = url.concat(user1.id.toString());
		return (
			<div className='Match-container-div'>
				{game_type}
				<div className='Match-Resultat'>
					{result}
				</div>
				<div className='Match-Summary'>
					<div className='Match-Player-score'>
						<div>You</div>
						<div className='Match-Player-points'>{score_user2}</div>
					</div>
					<div className='Match-VS'>
						VS
					</div>
					<div className='Match-Player-score'>
						<div>
							<Link to={url} >
								{data1?.username}
							</Link>
						</div>
						<div className='Match-Player-points'>{score_user1}</div>
					</div>
				</div>
			</div>
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
	};

	const handleClickUnblock = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let urltofetch : string;
		urltofetch = 'http://localhost:9999/api/users/me/banlist/' + uid;

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
	const [achievements, setAchievements] = useState<achievementProps>();
	const [matchs, setMatchs] = useState<matchHistoryProps>();
	const [error, setError] = React.useState("");
	
	useEffect(() => {
		const api = async () => {
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users/${uid}`;
			const data = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			})
			.then(data => {
				const jsonData = data.json()
				if (!data.ok)
					return (jsonData);
				setResult(jsonData);
				return null;
			})
			.then(data => setError(data != null ? data.message : null));
			// const jsonData = await data.json();
			// setResult(jsonData);

			const blocked = await fetch("http://localhost:9999/api/users/me/banlist/", {
				method: "GET",
				credentials: 'include'
			});
			const jsonBlocked = await blocked.json();
			setBlocked(jsonBlocked);

			const stats = await fetch(`http://localhost:9999/api/matches/${uid}/winrate`, {
				method: "GET",
				credentials: 'include'
			});
			const jsonStats = await stats.json();
			setStats(jsonStats);
			
			urltofetch = `http://localhost:9999/api/users/${uid}/achievements`;
			const achievements = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			});
			const jsonAchievement = await achievements.json();
			setAchievements(jsonAchievement);

			const matchs = await fetch(`http://localhost:9999/api/matches?user_id=${uid}`, {
				method: "GET",
				credentials: 'include'
			});
			const jsonMatchs = await matchs.json();
			setMatchs(jsonMatchs);
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

	if (error) {
		return(
			<NotFound />
		);
	} else {
		return(
			<React.Fragment>
				<h1>Profile - Stats</h1>
				<div className='Profile-container'>
					<div className='Profile-Alias'>
						<div className='Profile-Alias-div'>{data?.username}</div>
						<div className='Profile-Alias-div'>{AddOrRemoveButton(uid)}</div>
						{/* <div className='Profile-Alias-div'>{BlockOrUnblockButton(uid)}</div> */}
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
							<div><b>Level:</b> {FromEXPtoLvl(data?.exp)}</div>
							<div><b>To next level:</b> {ToNextLevel(data?.exp)} EXP</div>
						</div>
						<h4>Achievements</h4>
						<div className='Profile-achievement-container'>
							{achievements?.data.map((achievement:any) => {
								return(
									<OneAchievement achievement={achievement} />
								);
							})}
						</div>
						<h4>Match History</h4>
						<div className='Match-container-otherProfile'>
							{matchs?.data.map((match:any) => {
								return(
									
										<OneMatch match={match} />
									
								);
							})}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}