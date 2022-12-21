import './App.css'
import './Friend.css'

import * as React from 'react';
import { Link } from 'react-router-dom';

import Avatar from './link_botw_avatar.jpg';//a enlever quand plus nec

import OffLine from './offline.png';
import OnLine from './online.png';
import InGame from './ingame.png';
import { useState, useEffect } from "react";

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
	winNb: number;
	loseNb: number;
	friends: [];//?
	//une map pour ses friends (key = id du friend, value = structure similaire du friend)
	matchHistory: [];//?
	/*
		il me faudrait une liste avec :
			score du player
			pseudo de l'adversaire
			si l'adversaire est un friend
			score de l'adversaire
		une autre (???) avec :
			niveau fait ?
			reussite ? score ?
	*/
};

export function Friends(){
	const [data, setResult] = useState<resultProps>();

	useEffect(() => {
		const api = async () => {
		  const data = await fetch("http://localhost:9999/api/users/me", {
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
			<h1>Friends</h1>
			<div className='Friend-container'>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 1'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div  className='Friend-Name-status'>
							<div><img src={OnLine} alt={'Online'}></img></div>
							<div className='Friend-name'>Amigo 1</div>
						</div>
					</div>
				</Link>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 2'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div  className='Friend-Name-status'>
							<div><img src={OffLine} alt={'Offline'}></img></div>
							<div className='Friend-name'>Amigo 2</div>
						</div>
					</div>
				</Link>
				<Link to="/profile">
					<div className='Friend-container-div'>
						<div>
							<img src={Avatar} alt ={'Amigo 2'+'\'s avatar'} className='Friend-avatar'></img>
						</div>
						<div className='Friend-Name-status'>
							<div><img src={InGame} alt={'In Game'}></img></div>
							<div className='Friend-name'>Amigo 3</div>
						</div>
					</div>
				</Link>
			</div>
		</React.Fragment>
	);
}

export function FriendsZone(){
	// const isLoggedIn = props.isLoggedIn;
	// if (isLoggedIn){
		return (
			<Friends />
		);
	// }
	// else 
	// {
	// 	return (
	// 		<PleaseConnect />
	// 	);
	// }
}