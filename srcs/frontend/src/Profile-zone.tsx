import './App.css'
import './Profile.css'

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import MessageAchievement from './message_achievement.png';
import FriendAchievement from './friend_achievement.png';
import GameAchievement from './game_achievement.png';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import { PleaseConnect } from './adaptable-zone';
import {FromEXPtoLvl, ToNextLevel} from './tools'

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

type achievementProps = {
	data: [];
}

function OneAchievement(achievement: any){
	const {id, achievementTypeId, user} = achievement.achievement;
}

export function Profile(){
	const [data, setResult] = useState<resultProps>();
	const [invites, setInvites] = useState<invitesProps>();
	const [stats, setStats] = useState<statsProps>();
	const [achievements, setAchievements] = useState<achievementProps>();

	useEffect(() => {
		const api = async () => {
			const data = await fetch("http://localhost:9999/api/users/me", {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);
			
			const invites = await fetch("http://localhost:9999/api/users/me/friends/invites", {
				method: "GET",
				credentials: 'include'
			});
			const jsonInvites = await invites.json();
			setInvites(jsonInvites);
			
			const stats = await fetch("http://localhost:9999/api/users/me/winrate", {
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

	// const handleClickReject = async (uid: number) => {
		// let urltofetch : string;
		// urltofetch = 'http://localhost:9999/api/users/me/friends/invitations/' + uid;
		// console.log(urltofetch);//
		// const response = await fetch(urltofetch, {
		// 	headers: {
		// 		'Accept': 'application/json',
		// 		'Content-Type': 'application/json'
		// 	},
		// 	method: 'DELETE',
		// 	credentials: 'include',
		// });
	// 	console.log(response.json());//
	// };
	
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
						{invites?.data.map((user: any) => {
							var url: string = "/otherprofile";
							url = url.concat("/");
							url = url.concat(user.id);
							var uid = user.id;
							// console.log("uid = "+uid);
							return(
								<div className='Profile-invitation-received'>
									<div>
										<Link to={url} >
											<div>
												<img src={user.image_url} alt={user.username + "'s avatar"} className='Profile-invitation-received-img'></img>
											</div>
											<div>{user.username}</div>
										</Link>
										<div>
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
										</div>
										<div>
											{/* <IconButton color="error" aria-label="reject" onClick={handleClickReject(user.id)}> */}
											<IconButton color="error" aria-label="reject" onClick={()=>{
												let urltofetch : string;
												urltofetch = 'http://localhost:9999/api/users/me/friends/invites/' + uid;
												// console.log(urltofetch);//
												const response = fetch(urltofetch, {
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
										</div>
									</div>
								</div>
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