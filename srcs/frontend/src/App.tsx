import React from 'react';
import './App.css';
import './Menu.css';

import { OurHeader } from './Header-zone';
import { OurMenu } from './Menu-zone';
import { Home } from './adaptable-zone';
import { Play, SpecAMatch} from './adaptable-zone';
import { ChatZone } from './Chat-zone';
import { FriendsZone } from './Friend-zone';
import { MatchHistory } from './MatchHistory-zone';
import { SettingsZone } from './Settings-zone';
import { ProfileZone, OtherProfile } from './Profile-zone';
import { SignOn } from './adaptable-zone';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import { useState, useEffect } from "react";

type resultProps = {
	users: [];
}

export function ListUser(){//vouer à disparaitre
	const [data, setResult] = useState<resultProps>();
	
	useEffect(() => {
		const api = async () => {
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users/`;
			console.log(urltofetch);//
			const data = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setResult(jsonData);
			console.log(jsonData);//
		};
	
		api();
	}, []);
	return(
		{jsonData?.map((user) => {
				<div>
					{user.id}
				</div>
		}
		}
	);
}


function App() {
  return (
	<React.Fragment>
			<Router>
				<header>
					<OurHeader/>
				</header>
				<div className='Menu'>
					<OurMenu/>
				</div>
				<div className='Adaptable'>
					
					<Routes>
						<Route path="/chat" element={<ChatZone/>} />
						<Route path="/friends" element={<FriendsZone/>} />
						<Route path="/" element={<Home />} />
						<Route path="/matchhistory" element={<MatchHistory/>} />
						<Route path="/play" element={<Play/>} />
						<Route path="/settings" element={<SettingsZone/>} />
						<Route path="/specamatch" element={<SpecAMatch/>} />
						<Route path="/otherprofile" element={<OtherProfile uid={5} />} />
						<Route path="/profile" element={<ProfileZone/>} />
						<Route path="/signon" element={<SignOn/>} />
						<Route path='/ListUser' element={<ListUser />} />
					</Routes>
				</div>
			</Router>

	</React.Fragment>
	
  );
}

export default App;


