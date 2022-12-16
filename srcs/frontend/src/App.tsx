import React from 'react';
import './App.css';
import './Menu.css';

import { OurHeader } from './Header-zone';
import { OurMenu } from './Menu-zone';
import { Home } from './adaptable-zone';
import { Play, SpecAMatch} from './adaptable-zone';
import { Chat } from './Chat-zone';
import { Friends } from './Friend-zone';
import { MatchHistory } from './MatchHistory-zone';
import { Settings } from './Settings-zone';
import { Profile, OtherProfile } from './Profile-zone';
import { SignOn } from './adaptable-zone';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'



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
						<Route path="/chat" element={<Chat/>} />
						<Route path="/friends" element={<Friends/>} />
						<Route path="/" element={<Home />} />
						<Route path="/matchhistory" element={<MatchHistory/>} />
						<Route path="/play" element={<Play/>} />
						<Route path="/settings" element={<Settings/>} />
						<Route path="/specamatch" element={<SpecAMatch/>} />
						{/* <Route path="/otherprofile" element={<OtherProfile/>} /> */}
						<Route path="/profile" element={<Profile/>} />
						<Route path="/signon" element={<SignOn/>} />
					</Routes>
				</div>
			</Router>

	</React.Fragment>
	
  );
}

export default App;
