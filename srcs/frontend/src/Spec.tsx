import './App.css';
import './Spec.css'
import React, { useEffect, useState } from 'react';
import { PleaseConnect } from './adaptable-zone';
import { Link } from 'react-router-dom';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


type opponentProps = {
	username: string;
};

function DisplayMatch(match:any){
	const {user1, user2, game_mode} = match.match;
	const [data1, setResult1] = useState<opponentProps>();
	const [data2, setResult2] = useState<opponentProps>();

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
		};
	
		api();
	});

	var url1: string = "/otherprofile";
	url1 = url1.concat("/");
	url1 = url1.concat(user1.id.toString());
	var url2: string = "/otherprofile";
	url2 = url2.concat("/");
	url2 = url2.concat(user2.id.toString());

	if (game_mode === 'unicorn'){
		return(
			<div className='Spec-container-div-unicorn'>
				<div className='Spec-container-who'>
					<Link to={url1}>
						{data1?.username}
					</Link>
				</div>
				<div className='Spec-container-VS'>
					VS
				</div>
				<div className='Spec-container-who'>
					<Link to={url2}>
						{data2?.username}
					</Link>
				</div>
				<div className='empty'></div>
				<div className='Spec-container-watch-button'>
					<IconButton
						sx={{fontSize:"2rem"}}
						size="large"
						// onClick={handleClicksee}
					>
						<FontAwesomeIcon icon={faEye} />
					</IconButton>
				</div>
			</div>
		);
	} else {
		return(
			<div className='Spec-container-div'>
				<div className='Spec-container-who'>
					<Link to={url1}>
						{data1?.username}
					</Link>
				</div>
				<div className='Spec-container-VS'>
					VS
				</div>
				<div className='Spec-container-who'>
					<Link to={url2}>
						{data2?.username}
					</Link>
				</div>
				<div className='empty'></div>
				<div className='Spec-container-watch-button'>
					<IconButton
						sx={{fontSize:"2rem"}}
						size="large"
						// onClick={handleClicksee}
					>
						<FontAwesomeIcon icon={faEye} />
					</IconButton>
				</div>
			</div>
		);
	}
}

function SpecAMatch(){
	return(
		<React.Fragment>
			<h1>Spec a Match</h1>
			<div className='Spec-container'>
				{/* la div suiv est vouée a disparaitre, remplacée par l'utilisation de DisplayMatch */}
				<div className='Spec-container-div-unicorn'>
					<div className='Spec-container-who'>
						Aleyra
					</div>
					<div className='Spec-container-VS'>
						VS
					</div>
					<div className='Spec-container-who'>
						<Link to="\profile">
							Tlafay
						</Link>
						
					</div>
					<div className='empty'></div>
					<div className='Spec-container-watch-button'>
						<IconButton
							sx={{fontSize:"2rem"}}
							size="large"
							// onClick={handleClicksee}
						>
							<FontAwesomeIcon icon={faEye} />
						</IconButton>
					</div>
				</div>
				{/* idem avec celle-ci */}
				<div className='Spec-container-div'>
					<div className='Spec-container-who'>
						Aleyra
					</div>
					<div className='Spec-container-VS'>
						VS
					</div>
					<div className='Spec-container-who'>
						Tlafay
					</div>
					<div className='empty'></div>
					<div className='Spec-container-watch-button'>
						<IconButton
							sx={{fontSize:"2rem"}}
							size="large"
							// onClick={handleClicksee}
						>
							<FontAwesomeIcon icon={faEye} />
						</IconButton>
					</div>
				</div>
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