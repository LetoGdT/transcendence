import React from 'react';
import './App.css';
import './Menu.css';

import { getPaginatedRequest } from './tools';
import { OurHeader } from './Header-zone';
import { OurMenu } from './Menu-zone';
import { Home, NotFound } from './adaptable-zone';
import { Play, SpecAMatch} from './adaptable-zone';
import { ChatZone } from './Chat-zone';
import { FriendsZone } from './Friend-zone';
import { MatchHistoryZone } from './MatchHistory-zone';
import { SettingsZone } from './Settings-zone';
import { ProfileZone} from './Profile-zone';
import { OtherProfile } from './OtherProfile';
import { SignOn } from './adaptable-zone';
import { AuthWith2FA } from './authWith2fa';
import { Activate2FA } from './activate2fa';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { socket, websocketContext } from './WebsocketContext'

import { useState, useEffect} from "react";
import { Link } from 'react-router-dom'

type resultProps = {
}

function DisplayList(users:any){
	const {id, username} = users.users;
	var url: string = "/otherprofile/";
	url = url.concat(id);
	return(
		<div>
			<Link to={url} >
				{username}
			</Link>
		</div>
	);
}

export function ListUser(){//vouer à disparaitre

	const [data, setResult] = useState<resultProps>();

	useEffect(() => {
			const call = async () => {
				await getPaginatedRequest('users', setResult, 1, 2);
			};
			call();
	}, []);
	
	// console.log(data);//

	return(
		<div>
			{/* {data?.map((user: any) => {
				return(
					<DisplayList users={user}/>
				);
			})} */}
		</div>
	);
}

function App() {
	const router = 
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
						<Route path="/matchhistory" element={<MatchHistoryZone/>} />
						<Route path="/play" element={<Play/>} />
						<Route path="/settings" element={<SettingsZone/>} />
						<Route path="/specamatch" element={<SpecAMatch/>} />
						<Route path="/otherprofile/">
							<Route path=':uid' element={<OtherProfile />} />
						</Route>
						<Route path="/profile" element={<ProfileZone/>} />
						<Route path="/signon" element={<SignOn/>} />
						<Route path='/ListUser' element={<ListUser />} />
						<Route path='/2fa' element={<AuthWith2FA />} />
						<Route path='/activate2fa' element={<Activate2FA />} />
						<Route path='*' element={<NotFound/>} />
					</Routes>
				</div>
			</Router>

	if (true) // à changer quand on pourra savoir si le user est log ou pas
		return (
			<React.Fragment>
				<websocketContext.Provider value={socket}>
					{router}
				</websocketContext.Provider>
			</React.Fragment>
  );
	  else
		  return (
			  <React.Fragment>
				  {router}
			  </React.Fragment>
		  );
}

export default App;
