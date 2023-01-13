import React from "react";

function Play(){
	return(
		<React.Fragment>
			<h1>Play</h1>

		</React.Fragment>
	);
}

type meProps = {
};

export function PlayZone(){
	const [me, setMe] = useState<meProps>();

	useEffect(() => {
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
			<Play />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		);
	}
}