import React from 'react';
import './App.css';
import { OurMenu } from './menu-zone';

import { Home } from './adaptable-zone';
import { Play, SpecAMatch} from './adaptable-zone';
import { Chat } from './adaptable-zone';
import { Friends, MatchHistory, Settings, Profile } from './adaptable-zone';
import { PleaseConnect, SignOn } from './adaptable-zone';
import { Test } from './adaptable-zone';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import { OurHeader } from './header-zone';


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
						<Route path="/profile" element={<Profile/>} />
						<Route path="/pleaseconnect" element={<PleaseConnect/>} />
						<Route path="/signon" element={<SignOn/>} />
						<Route path="/test" element={<Test/>} />
					</Routes>
				</div>
			</Router>

	</React.Fragment>
	
  );
}

export default App;
