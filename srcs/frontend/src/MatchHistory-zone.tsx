import './App.css'
import './MatchHistory.css'

import * as React from 'react';
// import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

import { PleaseConnect } from './adaptable-zone';

type opponentProps = {
	username: string;
};

type meProps = {
	username: string;
	id: number;
}

type matchHistoryProps = {
	// score_user1: number;
	// score_user2: number;
	// game_type: string;
	// user1: [];
	// user2: [];
};

function OneMatch(user1id: number, user2id: number, score1: number, score2: number, type: string){
	
	const [data1, setResult1] = useState<opponentProps>();
	const [data2, setResult2] = useState<opponentProps>();
	const [me, setMe] = useState<meProps>();

	useEffect(() => {
		const api = async () => {
			let urltofetch1 : string;
			urltofetch1 = `http://localhost:9999/api/users/${user1id}`;
			const data1 = await fetch(urltofetch1, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData1 = await data1.json();
			setResult1(jsonData1);
			
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users/${user2id}`;
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

	if (user1id === me?.id){
		const result: string = (score1 > score2) ? "Victory" : "Defeat";
		return (
			<React.Fragment>
				{type}
				<div className='Match-Resultat'>
					{result}
				</div>
				<div className='Match-Summary'>
					<div className='Match-Player-score'>
						<div>You</div>
						<div className='Match-Player-points'>{score1}</div>
					</div>
					<div className='Match-VS'>
						VS
					</div>
					<div className='Match-Player-score'>
						<div>{data2?.username}</div>
						<div className='Match-Player-points'>{score2}</div>
					</div>
				</div>
			</React.Fragment>
			
		);
	} else {
		const result: string = (score2 > score1) ? "Victory" : "Defeat";
		return (
			<React.Fragment>
				{type}
				<div className='Match-Resultat'>
					{result}
				</div>
				<div className='Match-Summary'>
					<div className='Match-Player-score'>
						<div>You</div>
						<div className='Match-Player-points'>{score2}</div>
					</div>
					<div className='Match-VS'>
						VS
					</div>
					<div className='Match-Player-score'>
						<div>{data1?.username}</div>
						<div className='Match-Player-points'>{score1}</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export function MatchHistory(){
	const [data, setResult] = useState<matchHistoryProps>();

	useEffect(() => {
		const api = async () => {
			const data = await fetch("http://localhost:9999/api/users/me/matches/", {
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
			<h1>Your Matchs History</h1>
			<div className='Match-container'>
				<div className='Match-container-div'>
					{/* {
						data?.map((match: any) => {
								{OneMatch(match.user1.id, match.user2.id, match.score_user1, match.score_user2, match.game_type)}
						})
					} */}
				</div>
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