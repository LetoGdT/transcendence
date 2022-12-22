import './App.css'
import './MatchHistory.css'

import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

import { PleaseConnect } from './adaptable-zone';

type resultProps = {
	// email: string;
	// username: string;
	// image_url: string;
	// status: string;
	// rank: number;
	// level: number;
	// achievement: [];//?
	// //map avec par exemple id = nom de l'achievement, value = url d'une image
	// winNb: number;
	// loseNb: number;
	// friends: [];//?
	// //une map pour ses friends (key = id du friend, value = structure similaire du friend)
	// matchHistory: [];//?
	// /*
	// 	il me faudrait une liste avec :
	// 		score du player
	// 		pseudo de l'adversaire
	// 		si l'adversaire est un friend
	// 		score de l'adversaire
	// 	une autre (???) avec :
	// 		niveau fait ?
	// 		reussite ? score ?
	// 	*/
};

export function MatchHistory(){
	const [data, setResult] = useState<resultProps>();

	useEffect(() => {
		const api = async () => {
		  const data = await fetch("http://localhost:9999/api/users/me", {
			method: "GET",
			credentials: 'include'
		  });
		  const jsonData = await data.json();
		  setResult(jsonData);
		  console.log(jsonData);
		};
	
		api();
	  }, []);
	return(
		<React.Fragment>
			<h1>Your Matchs History</h1>
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

export function MatchHistoryZone(){
	// const isLoggedIn = props.isLoggedIn;
	// if (isLoggedIn){
		return (
			<MatchHistory />
		);
	// }
	// else 
	// {
	// 	return (
	// 		<PleaseConnect />
	// 	);
	// }
}