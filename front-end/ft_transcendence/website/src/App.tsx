import React from 'react';
import './App.css';
import { OurMenu } from './menu-zone';

import { Home } from './adaptable-zone';
import { Chat } from './adaptable-zone';

import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'


function App() {
  return (
	<React.Fragment>
		<Router>
			<div>
				<header className="Header">
					baniere + avatar-zone
				</header>
			</div>
			<div className='Menu'>
				<OurMenu/>
			</div>
			<div className='Adaptable'>
				<Routes>
					<Route path="/home">
						<Home/>
					</Route>
					<Route path="/chat">
							<Chat/>
					</Route>
				</Routes>
			</div>
		</Router>
	</React.Fragment>
	
  );
}

export default App;
