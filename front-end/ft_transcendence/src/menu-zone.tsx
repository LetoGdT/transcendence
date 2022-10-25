import React from 'react'
import { useState } from 'react'
import './App.css'

class Menu extends React.Component {
	render() {
		return(
			<nav className='Menu'>
				<table>
					<tr>
						<td>
							<button>
								<img src="src/home.png" className="menu_button" alt="Home" />
							</button>
						</td>
						<td>
							<button onClick={() => /*je sais pas*/>
								<img src="src/pong.png" className="menu_button" alt="Pong" />
							</button>
						</td>
						<td>
							<button>
								<img src="src/chat.png" className="menu_button" alt="Chat" />
							</button>
						</td>
						<td>
							<button>
								<img src="src/profile.png" className="menu_button" alt="Profile" />
							</button>
						</td>
					</tr>
				</table>
			</nav>
		);
	}
}