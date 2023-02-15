import './App.css';
import './Spec.css'
import React, { useEffect, useState } from 'react';
import { PleaseConnect } from './adaptable-zone';
import { Link, useNavigate } from 'react-router-dom';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { socket } from './WebsocketContext'

type matchInfo = {
	game_id: number;
	player1_id: number;
	player2_id: number;
	player1_username: string;
	player2_username: string;
}

function DisplayMatch({ match: { game_id, player1_id, player2_id, player1_username, player2_username } }: { match: matchInfo }) {
	const navigate = useNavigate();
	const url1 = `/otherprofile/${player1_id}`;
	const url2 = `/otherprofile/${player2_id}`;

	const handleClickSee = (event: any) => navigate(`/spectate/${game_id}`);

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
				<IconButton
					sx={{fontSize:"2rem"}}
					size="large"
					onClick={handleClickSee}
				>
					<FontAwesomeIcon icon={faEye} />
				</IconButton>
			</div>
		</div>
	);
	
}

function SpecAMatch(){
	const [games, setGames] = useState<matchInfo[]>([]);

	useEffect(() => {
		socket.emit('getGames');
		const refreshTimer = setInterval(() => {
			socket.emit('getGames');
		}, 1000);
		return () => clearInterval(refreshTimer);
	}, []);

	const updateGames = (games: matchInfo[]) => setGames(games);

	useEffect(() => {
		socket.on('returnGames', updateGames);
		return () => {
			socket.off('returnGames', updateGames);
		}
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

export function SpecZone(){
	const [me, setMe] = useState<Boolean>(false);

	useEffect(() => {
		const api = async () => {
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:9999/api/users/isconnected`, {
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