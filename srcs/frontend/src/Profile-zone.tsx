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
	data: [];
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
				<div>
					<img src={MessageAchievement} alt='1 sent in chat' className='Profile-achievement-container-div-img'></img>
				</div>
				<div>
					1st message sent
				</div>
			</div>
		);
	} else if (achievementType.name === "I'm a mundaine person"){
		return(
			<div className='Profile-achievement-container-div'>
				<div>
					<img src={FriendAchievement} alt='1 friend made' className='Profile-achievement-container-div-img'></img>
				</div>
				<div>
					1st friend get
				</div>
			</div>
		);
	} else if (achievementType.name === "I'm a gamer"){
		return(
			<div className='Profile-achievement-container-div'>
				<div>
					<img src={GameAchievement} alt='1 game played' className='Profile-achievement-container-div-img'></img>
				</div>
				<div>
					1st game played
				</div>
			</div>
		);
	} else {
		return(<div></div>);
	}
}

export function Profile(){
	const [data, setResult] = useState<resultProps>();
	const [invites, setInvites] = useState<invitesProps[]>([]);
	const [games, setGames] = useState<gamesProps[]>([]);
	const [stats, setStats] = useState<statsProps>();
	const [achievements, setAchievements] = useState<achievementProps[]>([]);

	useEffect(() => {
		const api = async () => {
			const data = await fetch("http://localhost:9999/api/users/me", {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);

			await getAllPaginated('users/me/friends/invites')
			.then(data => setInvites(data));

			socket.emit('getInvites');
			
			const stats = await fetch("http://localhost:9999/api/users/me/winrate", {
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
			console.log(games);//
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
				<div>
					<div className='Profile-game-info'>
						<div><b>Level:</b> {FromEXPtoLvl(data?.exp)}</div>
						<div><b>To next level:</b> {ToNextLevel(data?.exp)} EXP</div>
					</div>
					<h4>Achievements</h4>
					<div className='Profile-achievement-container'>
						{achievements.length > 0 && achievements.map((achievement:any) => {
							return(
								<OneAchievement achievement={achievement} />
							);
						})}
					</div>
					<h4>Invitations received for friendship</h4>
					<div>
						{invites.length > 0 && invites.map((user: any) => {
							var url: string = "/otherprofile";
							url = url.concat("/");
							url = url.concat(user.id);
							var uid = user.id;
							return(
								<React.Fragment>
									<div className='Profile-invitation-received'>
										<Link to={url} >
											<div>
												<img src={user.image_url} alt={user.username + "'s avatar"} className='Profile-invitation-received-img'></img>
											</div>
											<div>{user.username}</div>
										</Link>
										<div>
											<Link to="/profile">
												<IconButton color="success" aria-label="accept" onClick={()=>{
													const response = fetch('http://localhost:9999/api/users/me/friends', {
														headers: {
															'Accept': 'application/json',
															'Content-Type': 'application/json'
														},
														method: 'POST',
														credentials: 'include',
														body: JSON.stringify({ id: uid })
													});
												}}>
													<CheckIcon />
												</IconButton>
											</Link>
										</div>
										<div>
											<Link to="/profile">
												<IconButton color="error" aria-label="reject" onClick={()=>{
													let urltofetch : string;
													urltofetch = 'http://localhost:9999/api/users/me/friends/invites/' + uid;												const response = fetch(urltofetch, {
														headers: {
															'Accept': 'application/json',
															'Content-Type': 'application/json'
														},
														method: 'DELETE',
														credentials: 'include',
													});
												}}>
													<CloseIcon />
												</IconButton>
											</Link>
										</div>
									</div>
								</React.Fragment>
							);
						})}
					</div>
					<h4>Invitations received for playing a game</h4>
					<div>
						{	
							games.map(({ game_id, user }: any) => {
							var url: string = "/otherprofile";
							url = url.concat("/");
							url = url.concat(user.id);
							var uid = user.id;
							return(
								<React.Fragment>
									<div className='Profile-invitation-received'>
										<Link to={url} >
											<div>
												<img src={user.image_url} alt={user.username + "'s avatar"} className='Profile-invitation-received-img'></img>
											</div>
											<div>{user.username}</div>
										</Link>
										<div>
											<Link to="/play">
												<IconButton color="success" aria-label="accept" onClick={()=>{
													socket.emit('respondToInvite', { id: uid });
												}}>
													<CheckIcon />
												</IconButton>
											</Link>
										</div>
										<div>
											<Link to="/profile">
												<IconButton color="error" aria-label="reject" onClick={()=>{
													socket.emit('respondToInvite', { id: null });
												}}>
													<CloseIcon />
												</IconButton>
											</Link>
										</div>
									</div>
								</React.Fragment>
							);
						})}
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