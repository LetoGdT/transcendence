import './App.css'
import './Profile.css'

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Chart } from "react-google-charts";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useState, useEffect } from "react";
import { PleaseConnect } from './adaptable-zone';
import {FromEXPtoLvl, ToNextLevel, getAllPaginated} from './tools'
import GameAchievement from './game_achievement.png';
import MessageAchievement from './message_achievement.png';
import FriendAchievement from './friend_achievement.png';
import { socket } from './WebsocketContext';
import { Notification } from './Notifications';

type resultProps = {
	email: string;
	username: string;
	image_url: string;
	status: string;
	exp: number;

};

type statsProps = {
	wins: number;
	losses: number;
}

type invitesProps = {
};

type gamesProps = {
	data: [];
}

type achievementProps = {
	data: [];
}

export function OneAchievement(achievement: any){
	const {achievementType} = achievement.achievement;

	if (achievementType.name === "I'm a sociable person"){
		return(
			<div className='Profile-achievement-container-div'>
				<div key = "img">
					<img src={MessageAchievement} alt='1 sent in chat' className='Profile-achievement-container-div-img'></img>
				</div>
				<div key = "what">
					1st message sent
				</div>
			</div>
		);
	} else if (achievementType.name === "I'm a mundaine person"){
		return(
			<div className='Profile-achievement-container-div'>
				<div  key = "img">
					<img src={FriendAchievement} alt='1 friend made' className='Profile-achievement-container-div-img'></img>
				</div>
				<div key = "what">
					1st friend get
				</div>
			</div>
		);
	} else if (achievementType.name === "I'm a gamer"){
		return(
			<div className='Profile-achievement-container-div'>
				<div key = "img">
					<img src={GameAchievement} alt='1 game played' className='Profile-achievement-container-div-img'></img>
				</div>
				<div key = "what">
					1st game played
				</div>
			</div>
		);
	} else {
		return(<div key = "empty"></div>);
	}
}

function Profile(){
	const [data, setResult] = useState<resultProps>();
	const [invites, setInvites] = useState<invitesProps[]>([]);
	const [games, setGames] = useState<gamesProps[]>([]);
	const [stats, setStats] = useState<statsProps>();
	const [achievements, setAchievements] = useState<achievementProps[]>([]);

	useEffect(() => {
		const api = async () => {
			const data = await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me`, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);

			await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me/friends/invites`, {
				method: "GET",
				credentials: 'include'
			})
			.then(response => response.json())
			.then(data => { setInvites(data) });

			socket.emit('getInvites');
			
			const stats = await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me/winrate`, {
				method: "GET",
				credentials: 'include'
			});
			const jsonStats = await stats.json();
			setStats(jsonStats);

			await getAllPaginated('users/me/achievements')
			.then(data => setAchievements(data));
		};
	
		api();
	}, []);

	useEffect(() => {
		socket.on('returnInvites', (data) => {
			setGames(data);
		})
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
				<div key = "game info + invitations">
					<div className='Profile-game-info'>
						<div key = "lvl"><b>Level:</b> {FromEXPtoLvl(data?.exp)}</div>
						<div key = "till next lvl"><b>To next level:</b> {ToNextLevel(data?.exp)} EXP</div>
					</div>
					<h4>Achievements</h4>
					<div className='Profile-achievement-container'>
						{achievements.length > 0 && achievements.map((achievement:any) => {
							return(
								<OneAchievement achievement={achievement} key={achievement.id}/>
							);
						})}
					</div>
					<h4>Invitations received for friendship</h4>
					<div key = "invitation for friendship">
						{invites.length > 0 && invites.map((user: any) => {
							var url: string = "/otherprofile";
							url = url.concat("/");
							url = url.concat(user.id);
							var uid = user.id;
							return(
								<div className='Profile-invitation-received' key={user.id}>
									<Link to={url} >
										<div key = "img">
											<img src={user.image_url} alt={user.username + "'s avatar"} className='Profile-invitation-received-img'></img>
										</div>
										<div key = "name">
											{user.username}
										</div>
									</Link>
									<div key = "accept">
										<IconButton color="success" aria-label="accept" onClick={()=>{
											const response = fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me/friends`, {
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
										}}>
											<CheckIcon />
										</IconButton>
									</div>
									<div key = "refuse">
										<IconButton color="error" aria-label="reject" onClick={()=>{
											let urltofetch : string;
											urltofetch = `${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/me/friends/invites/` + uid;												const response = fetch(urltofetch, {
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
										}}>
											<CloseIcon />
										</IconButton>
									</div>
								</div>
							);
						})}
					</div>
					<h4>Invitations received for playing a game</h4>
					<div key = "invitation for playing">
						{	
							games.map(({ game_id, user }: any) => (
								<div className='Profile-invitation-received' key={game_id}>
									<Link to={`/otherprofile/${user.id}`} >
										<div key="img">
											<img src={user.image_url} alt={user.username + "'s avatar"} className='Profile-invitation-received-img'></img>
										</div>
										<div key = "name">
											{user.username}
										</div>
									</Link>
									<div key="accept">
										<Link to={`/join/${game_id}`}>
											<IconButton color="success" aria-label="accept">
												<CheckIcon />
											</IconButton>
										</Link>
									</div>
									<div key = "refuse">
										<IconButton color="error" aria-label="reject" onClick={()=>{
											socket.emit('refuseInvite', { game_id });
										}}>
											<CloseIcon />
										</IconButton>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export function ProfileZone(){
	const [me, setMe] = useState<Boolean>(false);

	useEffect(() => {
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
