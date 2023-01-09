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
	if (data1?.exp !== undefined)
		NewEXP1 = data1?.exp;
	let NewEXP2: number = 0;
	if (data2?.exp !== undefined)
		NewEXP2 = data2?.exp;
	let lvl1: number = FromEXPtoLvl(data1?.exp);
	let lvl2: number = FromEXPtoLvl(data2?.exp);
	let diffLvl: number = 0;

	if (lvl1 < lvl2){
		diffLvl = lvl2 - lvl1;
		if (usr1Score > usr2Score){
			if (usr2Score <= 1){
				NewEXP1 = NewEXP1 + 50 * diffLvl;
				if (NewEXP2 !== 0)
					NewEXP2 = NewEXP2 - 20 * diffLvl;
			} else {
				NewEXP1 = NewEXP1 + 25 * diffLvl;
				if (NewEXP2 !== 0)
					NewEXP2 = NewEXP2 - 10 * diffLvl;
			}
		} else if (usr1Score <= 1 && NewEXP1 !== 0){
				NewEXP1 = NewEXP1 - 5;
		}
	} else if (lvl1 > lvl2){
		diffLvl = lvl1 - lvl2;
		if (usr1Score < usr2Score) 
		{
			if (usr1Score <= 1){
				NewEXP2 = NewEXP2 + 50 * diffLvl;
				if (NewEXP1 !== 0)
					NewEXP1 = NewEXP1 - 20 * diffLvl;
			} else {
				NewEXP2 = NewEXP2 + 25 * diffLvl;
				if (NewEXP1 !== 0)
					NewEXP1 = NewEXP1 - 10 * diffLvl;
			}
		} else if (usr2Score <= 1 && NewEXP2 !== 0){
				NewEXP2 = NewEXP2 - 5;
		} 
	} else {
		if (usr1Score > usr2Score){
			if (usr2Score <= 1 && NewEXP2 !== 0){
				NewEXP2 = NewEXP2 - 10;
			}
			NewEXP1 = NewEXP1 + 20;
		} else {
			if (usr1Score <= 1 && NewEXP1 !== 0){
				NewEXP1 = NewEXP1 - 10;
			}
			NewEXP2 = NewEXP2 + 20;
		}
	}

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