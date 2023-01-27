import './App.css';
import './Spec.css'
import React, { useEffect, useState } from 'react';
import { PleaseConnect } from './adaptable-zone';
import { Link } from 'react-router-dom';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { socket } from './WebsocketContext'


type opponentProps = {
	username: string;
};

type gameProps = {
	game: { player1_id: number, player2_id: number };
}

type matchInfo = {
	player1_id: number;
	player2_id: number;
	player1_username: string;
	player2_username: string;
}

function DisplayMatch({ match: { player1_id, player2_id, player1_username, player2_username } }: { match: matchInfo }) {
	const url1 = `/otherprofile/${player1_id}`;
	const url2 = `/otherprofile/${player2_id}`;

	const handleClickSee = async (event:any) => {
		socket.emit('spectate', {
			player1_id,
			player2_id,
		});
	};

	return(
		<div className='Spec-container-div'>
			<div className='Spec-container-who'>
				<Link to={url1}>
					{player1_username}
				</Link>
			</div>
			<div className='Spec-container-VS'>
				VS
			</div>
			<div className='Spec-container-who'>
				<Link to={url2}>
					{player2_username}
				</Link>
			</div>
			<div className='empty'></div>
			<div className='Spec-container-watch-button'>
				<Link to="/play">
					<IconButton
						sx={{fontSize:"2rem"}}
						size="large"
						onClick={handleClickSee}
					>
						<FontAwesomeIcon icon={faEye} />
					</IconButton>
				</Link>
			</div>
		</div>
	);
	
}

function SpecAMatch(){
	// const [data1, setResult1] = useState<opponentProps>();
	// const [data2, setResult2] = useState<opponentProps>();
	const [games, setGames] = useState<matchInfo[]>([]);

	useEffect(() => {
		socket.emit('getGames');
		const refreshTimer = setInterval(() => {
			socket.emit('getGames');
		}, 1000);
		return () => clearInterval(refreshTimer);
		// const api = async () => {
		// 	let urltofetch1 : string;
		// 	urltofetch1 = `http://localhost:9999/api/users/${user1.id}`;
		// 	const data1 = await fetch(urltofetch1, {
		// 		method: "GET",
		// 		credentials: 'include'
		// 	});
		// 	const jsonData1 = await data1.json();
		// 	setResult1(jsonData1);
			
		// 	let urltofetch : string;
		// 	urltofetch = `http://localhost:9999/api/users/${user2.id}`;
		// 	const data2 = await fetch(urltofetch, {
		// 		method: "GET",
		// 		credentials: 'include'
		// 	});
		// 	const jsonData = await data2.json();
		// 	setResult2(jsonData);
		// };
		// api();
	}, []);

	useEffect(() => {
		socket.on('returnGames', (data) => {
			console.log(data);
			setGames(data);
		});
	}, []);

	return(
		<React.Fragment>
			<h1>Spec a Match</h1>
			<div className='Spec-container'>
				{games.map((match: matchInfo) => 
					<DisplayMatch key={`${match.player1_id}-${match.player2_id}`} match={match} />
				)}
			</div>
		</React.Fragment>
	);
}

type meProps = {
};

export function SpecZone(){
	const [me, setMe] = React.useState<meProps>();

	React.useEffect(() => {
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
			<SpecAMatch />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		);
	}
}