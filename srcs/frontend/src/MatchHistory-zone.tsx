import './App.css'
import './MatchHistory.css'

import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { getPaginatedRequest, getAllPaginated } from './tools';

import { PleaseConnect } from './adaptable-zone';

type opponentProps = {
	username: string;
};

type meProps = {
	username: string;
	id: number;
}

type matchHistoryProps = {
	data: [];
};

function OneMatch(match:any){
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

			const me = await fetch("http://localhost:9999/api/users/me", {
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

export function MatchHistory(){
	const [matchs, setMatchs] = useState<matchHistoryProps[]>([]);

	useEffect(() => {
		const call = async () => {
			await getAllPaginated('users/me/matches')
			.then(data => setMatchs(data));
		};
		call();
	}, []);
	return(
		<React.Fragment>
			<h1>Your Matchs History</h1>
			<div className='Match-container'>
				
					{matchs.map((match:any) => {
						return(
							
								<OneMatch match={match} />
							
						);
					})}
				
			</div>
		</React.Fragment>
	);
}

export function MatchHistoryZone(){
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
			<MatchHistory />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		);
	}
}