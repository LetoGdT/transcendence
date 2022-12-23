import './App.css'
import './Friend.css'

import * as React from 'react';

import { userStatus } from './tools';
import { PleaseConnect } from './adaptable-zone';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

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

type meProps = {
};

export function FriendsZone(){
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
			<Friends />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		);
	}
}