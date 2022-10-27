import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react'
import homeIcon from './assets/house-solid.svg'
import pongIcon from './assets/pong-solid.svg'
import profileIcon from './assets/user-solid.svg'
import chatIcon from './assets/comment-solid.svg'
import { useState } from 'react'
import './App.css'



export class Menu extends React.Component {
	constructor(props: any) {
		super(props);
		this.state = {
		};
	}

	handleHome() {
		
	}

	handleProfile() {
		return (
			<Fragment>
				<tr>Settings</tr>
				<tr>Stats</tr>
				<tr>Friend list</tr>
				<tr>Matchs history</tr>
			</Fragment>
		);
	}

	handlePong() {
		return(
			<Fragment>
				<tr>spec a match</tr>
				<tr>play</tr>
			</Fragment>
		);
	}

	handleChat() {
		return (
			<div>bouh</div>
		);
	}

	render() {
		return(
			<div>
				<table align='center'>
					<tr>
						<td>
							<img src={homeIcon} className="menu_button" alt="Home" onClick={this.handleHome} />
						</td>
						<td>
							<img src={pongIcon} className="menu_button" alt="Pong" onClick={this.handlePong}/>
						</td>
						<td>
							<img src={chatIcon} className="menu_button" alt="Chat" onClick={this.handleChat}/>
						</td>
						<td>
							<img src={profileIcon} className="menu_button" alt="Profile" onClick={this.handleProfile}/>
						</td>
					</tr>
				</table>
			</div>
		);
	}
}