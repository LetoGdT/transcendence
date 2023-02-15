import './Friend.css'

import React from 'react';

import OffLine from './offline.png';
import OnLine from './online.png';
import InGame from './ingame.png';

export async function getPaginatedRequest(url: string, pageStart: number, pageEnd: number,
	options?: { take?: number, params?: URLSearchParams }): Promise<any>
{
	let ret: any = [];
	const fullUrl = `http://${process.env.REACT_APP_HOSTNAME}:9999/api/` + url + '?';
	if (options === undefined || options.take === undefined){
		for (let i: number = pageStart - 1; i !== pageEnd; i++)
		{
			const params = new URLSearchParams({
				page: (i + 1).toString(),
				...(options && options.params && Object.fromEntries(options.params))
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
				take: options.take.toString(),
				page: (i + 1).toString(),
				...(options && options.params && Object.fromEntries(options.params))
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

export async function getAllPaginated(url: string,
	options?: { take?: 30, params?: URLSearchParams }): Promise<any>
{
	let ret: any = [];
	let take: string = "30";
	if (options !== undefined && options.take !== undefined)
		take = options.take.toString();
	const fullUrl = `http://${process.env.REACT_APP_HOSTNAME}:9999/api/` + url + '?';
	for (let i: number = 0;; i++)
	{
		const params = new URLSearchParams({
			take: take,
			page: (i + 1).toString(),
			...(options && options.params && Object.fromEntries(options.params))
		});
		const data = await fetch(fullUrl + params, {
			method: "GET",
			credentials: 'include'
		})
		.then(response => {
			if (!response.ok)
				throw new Error(`An error occured while fetching the api. Url: ${fullUrl + params}`,
					{ cause: response });
			return response;
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
		return(<img src={OnLine} alt='online' className='Friend-status'></img>);
	} else if (status === "offline") {
		return(<img src={OffLine} alt='offline' className='Friend-status'></img>);
	} else {
		return(<img src={InGame} alt='in game' className='Friend-status'></img>);
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
