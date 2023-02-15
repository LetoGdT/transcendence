import React, { useState, useEffect} from 'react';
import './App.css';

import { OurHeader } from './Header-zone';
import { OurMenu } from './Menu-zone';
import { Home, NotFound } from './adaptable-zone';
import { PlayZone } from './Play';
import { SpecZone } from './Spec';
import { Pong } from './pong/Pong';
import { ChatZone } from './Chat-zone';
import { FriendsZone } from './Friend-zone';
import { MatchHistoryZone } from './MatchHistory-zone';
import { SettingsZone } from './Settings-zone';
import { ProfileZone} from './Profile-zone';
import { OProfileZone } from './OtherProfile';
import { SignUp } from './adaptable-zone';
import { AuthWith2FA } from './authWith2fa';
import { Activate2FA, Desactivate2FA } from './activate2fa';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { socket, websocketContext } from './WebsocketContext';
import {Toaster} from 'react-hot-toast';
import { setUpNewMessageNotificationsFn, setUpNewGameNotificationFn } from './Notifications';
import { SetPGameZone } from './SetPrivateGame';
import { SetChanZone } from './SetChannel';
import { ManaChanZone } from './ManageChannel';

function App() {
	const router = 
		<Router>
			<header>
				<OurHeader/>
			</header>
			<div className='Menu'>
				<OurMenu/>
			</div>
			<div>
				<Toaster />
			</div>
			<div className='Adaptable'>
					<Routes>
						<Route path="/chat" element={<ChatZone/>} />
						<Route path="/friends" element={<FriendsZone/>} />
						<Route path="/" element={<Home />} />
						<Route path="/matchhistory" element={<MatchHistoryZone/>} />
						<Route path="/play" element={<PlayZone/>} />
						<Route path="/settings" element={<SettingsZone/>} />
						<Route path="/specamatch" element={<SpecZone/>} />
						<Route path="/otherprofile/">
							<Route path=':uid' element={<OProfileZone />} />
						</Route>
						<Route path="/spectate/:game_id" element={<Pong mode="spectate" />} />
						<Route path="/join/:game_id" element={<Pong mode="private" />} />
						<Route path='/pong' element={<Pong mode="ranked" />} />
						<Route path="/setprivategame">
							<Route path=':uid' element={<SetPGameZone />} />
						</Route>
						<Route path="/managechannel">
							<Route path=':cid' element={<ManaChanZone />} />
						</Route>
						<Route path="/profile" element={<ProfileZone/>} />
						<Route path="/signup" element={<SignUp/>} />
						<Route path='/2fa' element={<AuthWith2FA />} />
						<Route path='/setchannel' element={<SetChanZone />} />
						<Route path='/activate2fa' element={<Activate2FA />} />
						<Route path='/desactivate2fa' element={<Desactivate2FA />} />
						<Route path='*' element={<NotFound/>} />
					</Routes>
				</div>
			</Router>

	const [me, setMe] = useState<Boolean>();

	useEffect(() => {
		const api = async () => {
			await fetch(`http://${process.env.REACT_APP_HOSTNAME}:9999/api/users/isconnected`, {
				method: "GET",
				credentials: 'include'
			})
			.then((response) => {
				if (!response.ok)
					setMe(false);
				else
					setMe(true);
			});
		};
	
		api();

		setUpNewMessageNotificationsFn();
		setUpNewGameNotificationFn();
	}, []);
	
	const isLoggedIn = me;
	if (isLoggedIn) // à changer quand on pourra savoir si le user est log ou pas
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
