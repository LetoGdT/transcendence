import React from 'react'
import { useState } from 'react'
import './App.css'

class Menu extends React.Component {
	constructor(props: any) {
		super(props);
		this.state = {
			item_menu: "",
			pong_item: Array(2),
			profile_item: Array(4),
		};
	}

	handleClick(item_menu: string) {
		if (item_menu = "pong"){
			<tr>spec a match</tr>
			<tr>play</tr>
		}
		else if (item_menu = "profile"){
			<tr>Settings</tr>
			<tr>Stats</tr>
			<tr>Friend list</tr>
			<tr>Matchs history</tr>
		}
		else if (item_menu = "home") {

		}
		else if (item_menu = "chat") {

		}
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
							<button /*onClick={() => }*/>
								<img src="src/pong.png" className="menu_button" alt="Pong" />
							</button>
						</td>
						<td>
							<button /*onClick={() => }*/>
								<img src="src/chat.png" className="menu_button" alt="Chat" />
							</button>
						</td>
						<td>
							<button /*onClick={() => }*/>
								<img src="src/profile.png" className="menu_button" alt="Profile" />
							</button>
						</td>
					</tr>
				</table>
			</nav>
		);
	}
}