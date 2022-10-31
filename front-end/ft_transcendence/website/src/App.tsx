import React from 'react';
import './App.css';
import { OurMenu } from './menu-zone';

import { Home } from './adaptable-zone';
import { Chat } from './adaptable-zone';

import { BrowserRouter as Router, Route } from 'react-router-dom'


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

			</div>
		</Router>
	</React.Fragment>
	
  );
}

export default App;
