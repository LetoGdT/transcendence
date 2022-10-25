import React from 'react'
import { useState } from 'react'
import './App.css'

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			item_menu: "",
		};
	}

	handleClick(item_menu) {
		if (item_menu = "home")
	}

	render() {
		return(
			<nav className='Menu'>
				<table>
					<tr>
						<td>
							<button /*onClick={() => }*/>
								<img src="src/home.png" className="menu_button" alt="Home" />
							</button>
						</td>
						<td>
							<button onClick={() => 
								<tr>spec a match</tr>
								<tr>play</tr>
							}>
								<img src="src/pong.png" className="menu_button" alt="Pong" />
							</button>
						</td>
						<td>
							<button /*onClick={() => }*/>
								<img src="src/chat.png" className="menu_button" alt="Chat" />
							</button>
						</td>
						<td>
							<button onClick={() => 
								<tr>Settings</tr>
								<tr>Stats</tr>
								<tr>Friend list</tr>
								<tr>Matchs history</tr>
							}>
								<img src="src/profile.png" className="menu_button" alt="Profile" />
							</button>
						</td>
					</tr>
				</table>
			</nav>
		);
	}
}