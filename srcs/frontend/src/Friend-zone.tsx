import './App.css'
import './Friend.css'

import * as React from 'react';

import { userStatus } from './tools';
import { PleaseConnect } from './adaptable-zone';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { getAllPaginated } from './tools';

type resultProps = {
	data: [];
}

function Friends(){
	const [data, setResult] = useState<resultProps[]>([]);

	useEffect(() => {
		const call = async () => {
			await getAllPaginated('users/me/friends')
			.then(data => setResult(data));
		};
		call();
	}, []);

	return(
		<React.Fragment>
			<h1>Friends</h1>
			<div className='Friend-container'>
				{data.length > 0 && data?.map((user: any) => {
					var url: string = "/otherprofile";
					url = url.concat("/");
					url = url.concat(user.id);
					return(
						<Link to={url} key={user.id}>
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
	const [me, setMe] = useState<Boolean>(false);

	useEffect(() => {
		const api = async () => {
			await fetch("http://localhost:9999/api/users/isconnected", {
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
