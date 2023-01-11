import React, { useEffect, useState } from 'react';
// import { useState, useEffect } from "react";

import OffLine from './offline.png';
import OnLine from './online.png';
import InGame from './ingame.png';

export async function getPaginatedRequest(url: string, pageStart: number, pageEnd: number, take?: number): Promise<any>
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
	return ret;
}

export async function getAllPaginated(url: string, take = 30): Promise<any>
{
	let ret: any = [];
	const fullUrl = 'http://localhost:9999/api/' + url + '?';
	for (let i: number = 0;; i++)
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
	return ret;
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

const EXPtoNewLevel: number = 100;

export function FromEXPtoLvl(exp: number | undefined){
	if (exp === undefined)
		return(
			0
		);
	
	let level: number = Math.floor(exp / EXPtoNewLevel);	
	return(
		level
	);
}

export function ToNextLevel(exp: number | undefined){
	if (exp === undefined)
		return(
			EXPtoNewLevel
		);
	
	let toNextLevel: number = (FromEXPtoLvl(exp) + 1) * EXPtoNewLevel - exp;
	return(
		toNextLevel
	);
}

type userProps = {
	exp: number;
};

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