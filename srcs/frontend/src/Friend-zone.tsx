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
	data: [];
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
									<div>
										{/* {() => {if(user.status === "online"){
											return(
												<img src={OnLine} alt={user.status}></img>
											);
										} else if(user.status === "offline"){
											return(
												<img src={OffLine} alt={user.status}></img>
											);
										} else {
											return(
												<img src={InGame} alt={user.status}></img>
											);
										}}} */}
									</div>
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