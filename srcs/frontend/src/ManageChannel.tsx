import './App.css';
import './SetChannel.css';
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { NotFound } from './adaptable-zone';

type userProps = {
	id: number;
	username: string;
	image_url: string;
}



export function ManageChannel(){
	let { cid } = React.useParam();
	const [me, setMe] = React.useState<userProps>();

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

	// if (/*me n'est pas admin*/){
	// 	return(
	// 		<NotFound />
	// 	);
	// } else {
		return(
			<div className='Manage-Channel-container'>
				<div className=''
			</div>
		);
	// }

}

/*
	modifier le status
	modifier en psw
	ban ou kick un user
	set un user comme admin
*/