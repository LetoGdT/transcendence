import React from 'react';
import './App.css';
import { OurMenu } from './menu-zone';

import { Home } from './adaptable-zone';
import { Play, SpecAMatch} from './adaptable-zone';
import { Chat } from './adaptable-zone';
import { Friends, MatchHistory, Profile, Stats } from './adaptable-zone';
import { PleaseConnect } from './adaptable-zone';
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
					<Route path="/profile" element={<Profile/>} />
					<Route path="/specamatch" element={<SpecAMatch/>} />
					<Route path="/stats" element={<Stats/>} />
					<Route path="/pleaseconnect" element={<PleaseConnect/>} />
				</Routes>
			</div>
		</Router>
	</React.Fragment>
	
  );
}

export default App;
