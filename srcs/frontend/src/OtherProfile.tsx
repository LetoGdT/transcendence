import './App.css'
import './Profile.css'
import './MatchHistory.css'
import * as React from 'react';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import { NotFound, PleaseConnect } from './adaptable-zone';
import { FromEXPtoLvl, getAllPaginated, ToNextLevel } from './tools';
import { OneAchievement } from './Profile-zone';
import { socket } from './WebsocketContext';
import { Notification } from './Notifications';

type resultProps = {
	email: string;
	username: string;
	image_url: string;
	status: string;
	exp: number;
	id: number;
};

type friendProps = {
	data: [];
};

type blockedProps = {
	id: number;
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

const AskButton = styled(Button)({
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
		})
		.then(response => {
			if (!response.ok)
				return response.json();
			else
				window.location.reload();
		})
		.then(data => {if (data !== undefined) Notification(data.message)});
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
		})
		.then(response => {
			if (!response.ok)
				return response.json();
			else
				window.location.reload();
		})
		.then(data => {if (data !== undefined) Notification(data.message)});
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
		})
		.then(response => {
			if (!response.ok)
				return response.json();
			else
				window.location.reload();
		})
		.then(data => {if (data !== undefined) Notification(data.message)});
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
		})
		.then(response => {
			if (!response.ok)
				return response.json();
			else
				window.location.reload();
		})
		.then(data => {if (data !== undefined) Notification(data.message)});
	};

	const [blocked, setBlocked] = useState<blockedProps[]>([]);

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

	const toFind: number = blocked.findIndex((user) => {
		return user.id == Number(uid);
	});

	if (toFind === -1){
		return(
			<BlockButton variant="contained" disableRipple onClick={handleClickBlock}>Block</BlockButton>
		);
	} else {
		return(
			<UnblockButton variant="contained" disableRipple onClick={handleClickUnblock}>Unblock</UnblockButton>
		);
	}
}

function OneMatch(match:any){
	let { uid } = useParams();
	const {user1, user2, score_user1, score_user2, game_type} = match.match;
	const [data1, setResult1] = useState<opponentProps>();
	const [data2, setResult2] = useState<opponentProps>();
	const [me, setMe] = useState<meProps>();

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
	
	var url: string = "/otherprofile";
	url = url.concat("/");

	if (user1.id === me?.id){
		const result: string = (score_user1 > score_user2) ? "Victory" : "Defeat";
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

function OtherProfile(){
	let { uid } = useParams();
	const [is404, setIs404] = React.useState(false);
	const [data, setResult] = useState<resultProps>();
	const [stats, setStats] = useState<statsProps>();
	const [achievements, setAchievements] = useState<achievementProps[]>([]);
	const [matchs, setMatchs] = useState<matchHistoryProps[]>([]);
	const [error, setError] = React.useState("");
	
	useEffect(() => {
		const api = async () => {
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users/${uid}`;
			const data = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			})
			.then(response => {
				if (!response.ok)
				{
					throw new Error("Api returned an error", { cause: response });
				}
				return response.json();
			})
			.then(jsonData => setResult(jsonData))
			.catch((err) => {
				if (err.cause.status === 404)
				{
					setIs404(true);
					return null;
				}
				else
					return err.cause.json();
			})
			.then(data => setError(data != null ? data.message : null));

			const stats = await fetch(`http://localhost:9999/api/matches/${uid}/winrate`, {
				method: "GET",
				credentials: 'include'
			});
			const jsonStats = await stats.json();
			setStats(jsonStats);

			await getAllPaginated(`users/${uid}/achievements`)
			.then(data => setAchievements(data));

			if (uid !== undefined)
			{
				await getAllPaginated('matches', { params: new URLSearchParams({ user_id: uid }) })
				.then(data => setMatchs(data));
			}
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

	const handleClickChat = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let convExists: boolean = false;
		await fetch(`http://localhost:9999/api/conversations?user2_id=${uid}`, {
			method: "GET",
			credentials: 'include', 
		})
		.then(response=>response.json())
		.then(data => convExists = data.data.length !== 0);
		if (!convExists) {
			const response = await fetch(`http://localhost:9999/api/conversations/`, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ recipient_id: uid })
			})
			.then(response => {
				if (!response.ok)
					return response.json();
				else
					socket.emit("newConv", {id: uid});
			})
			.then(data => {if (data !== undefined) Notification(data.message)});
		}
	};

	var url_aksgame: string = "/setprivategame/";
	if (uid !== undefined){
		url_aksgame = url_aksgame.concat(uid.toString());
	}

	if (!is404) {
		return(
			<React.Fragment>
				<h1>Profile - Stats</h1>
				<div className='Profile-container'>
					<div className='Profile-Alias'>
						<div className='Profile-Alias-div'>{data?.username}</div>
						<div className='Profile-Alias-div'>{AddOrRemoveButton(uid)}</div>
						<div className='Profile-Alias-div'>{BlockOrUnblockButton(uid)}</div>
						<div className='Profile-Alias-div'><Link to={url_aksgame}><AskButton variant="contained" disableRipple>Ask for a game</AskButton></Link></div>
						<div className='Profile-Alias-div'><Link to="/chat"><AskButton variant="contained" disableRipple onClick={handleClickChat}>Chat in private</AskButton></Link></div>
						{/*button pour spec ?*/}
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
							{achievements.length > 0 && achievements.map((achievement:any) => {
								return(
									<OneAchievement achievement={achievement} key={achievement.id}/>
								);
							})}
						</div>
						<h4>Match History</h4>
						<div className='Match-container-otherProfile'>
							{matchs.length > 0 && matchs.map((match:any) => {
								return(
										<OneMatch match={match} key={match.id}/>
								);
							})}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
	else
	{
		return (
			<NotFound />
		);
	}
}

export function OProfileZone(){
	let { cid } = useParams();
	const [me, setMe] = React.useState<Boolean>(false);

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
	
	const isLoggedIn = me;
	if (isLoggedIn){
		return (
			<OtherProfile />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		 );
	}
}

