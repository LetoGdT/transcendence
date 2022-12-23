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
import userEvent from '@testing-library/user-event';

type resultProps = {
	data: [];
}

export function userStatus(status: string){
	if(status === "online"){
		return(<img src={OnLine} alt='online'></img>);
	} else if (status === "offline") {
		return(<img src={OffLine} alt='offline'></img>);
	} else {
		return(<img src={InGame} alt='in game'></img>);
	}
}


export function Friends(){
	const [data, setResult] = useState<resultProps>();

	useEffect(() => {
		const api = async () => {
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users/me/friends`;
			const data = await fetch(urltofetch, {
			method: "GET",
			credentials: 'include'
		  });
		  const jsonData = await data.json();
		  setResult(jsonData);
		  console.log(jsonData);//
		};
	
		api();
	}, []);

	let status: string;

	return(
		<React.Fragment>
			<h1>Friends</h1>
			<div className='Friend-container'>
				{data?.data.map((user: any) => {
					var url: string = "/otherprofile";
					url = url.concat("/");
					url = url.concat(user.id);
					return(
						<Link to={url} >
							<div className='Friend-container-div'>
								<div>
									<img src={user.image_url} alt={user.username + "'s avatar"} className='Friend-avatar'></img>
								</div>
								<div className='Friend-Name-status'>
									<div>{userStatus(user.status)}</div>
									<div className='Friend-name'>{user.username}</div>
								</div>
							</div>
						</Link>
					);
				})}
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