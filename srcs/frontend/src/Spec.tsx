import React from 'react';
import { PleaseConnect } from './adaptable-zone';

function SpecAMatch(){
	return(
		<React.Fragment>
			<h1>Play</h1>
			
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