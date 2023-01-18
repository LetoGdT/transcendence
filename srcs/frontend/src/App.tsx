import React from 'react';
import './App.css';

import { OurHeader } from './Header-zone';
import { OurMenu } from './Menu-zone';
import { Home, NotFound } from './adaptable-zone';
import { PlayZone } from './Play';
import { SpecZone } from './Spec';
import { ChatZone } from './Chat-zone';
import { FriendsZone } from './Friend-zone';
import { MatchHistoryZone } from './MatchHistory-zone';
import { SettingsZone } from './Settings-zone';
import { ProfileZone} from './Profile-zone';
import { OtherProfile } from './OtherProfile';
import { SignUp } from './adaptable-zone';
import { AuthWith2FA } from './authWith2fa';
import { Activate2FA } from './activate2fa';
import { Pong } from './pong/Pong';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { socket, websocketContext } from './WebsocketContext'
import { useState, useEffect } from 'react';
import toast, {Toaster} from 'react-hot-toast';

const newGame = () => {
	toast.custom(
		<div className='Notif'>
			You've got a new invitation for a game.<br></br>
			Please go to your profile to accept or reject.
		</div>,
		{
			duration: 5000,
			position: 'top-center',
		
			// Styling
			// style: {
			// 	borderRadius: '10px',
			// 	background: '#007dd6',
			// 	color: '#fff',
			// },
			// className: '',
		
			// Custom Icon
			// icon: '👏',
		
			// Change colors of success/error/loading icon
			// iconTheme: {
			//   primary: '#000',
			//   secondary: '#fff',
			// },
		
			// Aria
			ariaProps: {
			role: 'status',
			'aria-live': 'polite',
			},
		}
	);
};

const newMessage = () => {
	toast.custom(
		<div className='Notif'>
			You've got a new message in chat.
		</div>,
		{
			duration: 5000,
			position: 'top-center',

			// Aria
			ariaProps: {
			role: 'status',
			'aria-live': 'polite',
			},
		}
	);
};

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
				<button onClick={newGame}>Make me a toast</button>
				<button onClick={newMessage}>Make me a toast</button>
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
							<Route path=':uid' element={<OtherProfile />} />
						</Route>
						<Route path="/profile" element={<ProfileZone/>} />
						<Route path="/signup" element={<SignUp/>} />
						<Route path='/2fa' element={<AuthWith2FA />} />
						<Route path='/activate2fa' element={<Activate2FA />} />
						<Route path='/pong' element={<Pong/>} />
						<Route path='*' element={<NotFound/>} />
					</Routes>
				</div>
			</Router>

	type meProps = {
		id: number;
		username: string;
		image_url: string;
	}
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
