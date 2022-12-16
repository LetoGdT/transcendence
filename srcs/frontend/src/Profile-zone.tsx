import './App.css'
import './Profile.css'

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

import Avatar from './link_botw_avatar.jpg';//a enlever quand plus nec

import OffLine from './offline.png';
import OnLine from './online.png';
import InGame from './ingame.png';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";

type resultProps = {
	email: string;
	username: string;
	image_url: string;
	rank: number;
	level: number;
	achievement: string[];//?
	//map avec par exemple id = nom de l'achievement, value = url d'une image
	winNb: number;
	loseNb: number;
	drawNb:number;
	friends: string[];//?
	//une map pour ses friends (key = id du friend, value = structure similaire du friend)
	matchHistory: string[];//?
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


const AddButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#3b9b3b',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#4a7a4a',
		borderColor: '#646464',
	},
	'&:focus': {
		xShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

const RemoveButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#bb1d03',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#891d03',
		borderColor: '#646464',
	},
	'&:focus': {
		boxShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},  
});

export const options = {
	title: "Your matches' results",
	backgroundColor: 'black',
	colors: ['#009900', '#cc0000', '#646464'],
	legend: {textStyle: {color: 'gray', fontSize: '15'}}
};

export const gameData = [
	["Result", "nb"],
	// ["Victories", {data?.winNb}],
	// ["Defeats", {data?.loseNb}],
	// ["Draws", {data?.drawNb}],
	["Victories", 11],
	["Defeats", 5],
	["Draws", 2],
];

export function OtherProfile(pseudo: string){
	const [data, setResult] = useState<resultProps>();

	useEffect(() => {
		const api = async () => {
		  const data = await fetch("http://localhost:9999/api/users/" + pseudo, {
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
			<h1>Profile - Stats</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<div className='Profile-container'>
				<div className='Profile-Alias'>
					<div className='Profile-Alias-div'>{data?.username}</div>
					{/* <div>{data?.email}</div> */}
					<div className='Profile-Alias-div'><AddButton variant="contained" disableRipple>Add to Friends</AddButton></div>
					{/* <div className='Profile-Alias-div'><RemoveButton variant="contained" disableRipple>Remove from Friends</RemoveButton></div> */}
				</div>
				<div className='Profile-container-row-lvl1'>
					<div className='Profile-Avatar'>
						<img src={data?.image_url} alt="alias' avatar" className='Profile-avatar-img'></img>
					</div>
					<div className='Profile-Pie-Charts'>
						<Chart
							chartType="PieChart"
							data={gameData}
							options={options}
							width={"100%"}
							height={"400"}
						/>
					</div>
				</div>
				<div>
					<div className='Profile-game-info'>
						<div><b>Rank:</b> {data?.rank}</div>
						<div><b>Level:</b> {data?.level}</div>
					</div>
					<h4>Achievements</h4>
					<div className='Profile-achievement-container'>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={Avatar} alt='achievement 1' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								Achivement 1
							</div>
						</div>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={Avatar} alt='achievement 2' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								Achivement 2
							</div>
						</div>
					</div>

				</div>
			</div>
		</React.Fragment>
	);
}

export function Profile(){
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
			<h1>Profile - Stats</h1>
			<p>si user non connecter renvoyer vers /pleaseconnect</p>
			<div className='Profile-container'>
				<div className='Profile-Alias'>
					<div className='Profile-Alias-div'>{data?.username}</div>
					{/* <div className='Profile-Alias-div'><AddButton variant="contained" disableRipple>Add to Friends</AddButton></div>
					<div className='Profile-Alias-div'><RemoveButton variant="contained" disableRipple>Remove from Friends</RemoveButton></div> */}
				</div>
				<div className='Profile-container-row-lvl1'>
					<div className='Profile-Avatar'>
						<img src={data?.image_url} alt="alias' avatar" className='Profile-avatar-img'></img>
					</div>
					<div className='Profile-Pie-Charts'>
						<Chart
							chartType="PieChart"
							data={gameData}
							options={options}
							width={"100%"}
							height={"400"}
						/>
					</div>
				</div>
				<div>
					<div className='Profile-game-info'>
						<div><b>Rank:</b> {data?.rank}</div>
						<div><b>Level:</b> {data?.level}</div>
					</div>
					<h4>Achievements</h4>
					<div className='Profile-achievement-container'>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={Avatar} alt='achievement 1' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								Achivement 1
							</div>
						</div>
						<div className='Profile-achievement-container-div'>
							<div>
								<img src={Avatar} alt='achievement 2' className='Profile-achievement-container-div-img'></img>
							</div>
							<div>
								Achivement 2
							</div>
						</div>
					</div>

				</div>
			</div>
		</React.Fragment>
	);
}