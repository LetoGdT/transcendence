import React, { useEffect, useState } from 'react';
// import { useState, useEffect } from "react";

import OffLine from './offline.png';
import OnLine from './online.png';
import InGame from './ingame.png';

export async function getPaginatedRequest(url: string, setResult: Function, pageStart: number, pageEnd: number, take?: number): Promise<any>
{
	let ret: any = [];
	const fullUrl = 'http://localhost:9999/api/' + url + '?';
	if (take === undefined){
		for (let i: number = pageStart - 1; i !== pageEnd; i++)
		{
			const params = new URLSearchParams({
				page: (i + 1).toString()
			});
			const data = await fetch(fullUrl + params, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			ret = ret.concat(jsonData.data);
			if (!jsonData.meta.hasNextPage)
				break;
		}
	}
	else {
		for (let i: number = pageStart - 1; i !== pageEnd; i++)
		{
			const params = new URLSearchParams({
				take: take.toString(),
				page: (i + 1).toString()
			});
			const data = await fetch(fullUrl + params, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			ret = ret.concat(jsonData.data);
			if (!jsonData.meta.hasNextPage)
				break;
		}
	}
	
	setResult(ret)
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

export function FromEXPtoLvl(exp: number | undefined){
	if (exp === undefined)
		return(
			0
		);
	let EXPtoNewLevel: number = 100;
	let level: number = Math.floor(exp/EXPtoNewLevel);	
	return(
		level
	);
}

type userProps = {
	exp: number;
};

function updateEXP(usrid: number, usrEXP: number | undefined){
	
}

export function NewExp(usr1id: number, usr2id: number, usr1Score: number, usr2Score: number){
	const [data1, setResult1] = useState<userProps>();
	const [data2, setResult2] = useState<userProps>();

	useEffect(() => {
		const api = async () => {
			let urltofetch1 : string;
			urltofetch1 = `http://localhost:9999/api/users/${usr1id}`;
			const data1 = await fetch(urltofetch1, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData1 = await data1.json();
			setResult1(jsonData1);

			let urltofetch2 : string;
			urltofetch2 = `http://localhost:9999/api/users/${usr2id}`;
			const data2 = await fetch(urltofetch2, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData2 = await data2.json();
			setResult2(jsonData2);
			
		};
	
		api();
	}, []);

	let NewEXP1: number = 0;
	let NewEXP2: number = 0;
	let lvl1: number = FromEXPtoLvl(data1?.exp);
	let lvl2: number = FromEXPtoLvl(data2?.exp);

	if (lvl1 < lvl2){

	} else if (lvl1 > lvl2){

	} else {
		
	}
	/*
- face à un joueur de rank inferieur (strict) tu peux pas gagner de l'exp mais seulement en perdre et la quantité perdu est du genre :
     * si t'as pris une raclée (donc au mieux 1 vs 5) tu perds le double que si t'as pas pris de raclée mais que tu as perdu quand meme donc -10 en temps normal -20 en cas de raclée
     * le tout est multiplié par la diff de rank : donc si t'es de rank 5 et ton adversaire est de rank 3 c'est multiplié par 2
- face à un joueur de rank supérieur (strict) :
     * tu perds d'une petite quantité d'exp en cas de defaite genre -5 sauf si t'as perdu de justesse genre 4 vs 5, là tu perds rien
     * en cas de victoire classique tu gagnes 25 x la difference de rank 
     * en cas de victoire type raclée tu gagnes 50 x la defference de rank
- face à un joueur de meme rank :
     * en cas de raclée tu perds -10,
     * defaite de justesse : tu perds rien
     * victoire : +20*/
}

// type isConnectedResult = {

// };

// export async function IsConnected(){//a faire
// 	const [isConnected, setIsConnected] = useState<isConnectedResult>();

// 	useEffect(() => {
// 		const api = async () => {
// 			const data = await fetch("http://localhost:9999/api/users/isconnected", {
// 				method: "GET",
// 				credentials: 'include'
// 			});
// 			// const jsonData = await data.json();
// 			// setIsConnected(jsonData);
// 			setIsConnected(data);
// 		};
// 		api();
// 	}, []);
	
// }