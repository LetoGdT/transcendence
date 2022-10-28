import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment } from 'react'
import homeIcon from './assets/house-solid.svg'
import pongIcon from './assets/pong-solid.svg'
import profileIcon from './assets/user-solid.svg'
import chatIcon from './assets/comment-solid.svg'
import { useState } from 'react'
import './App.css'

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export function OurMenu() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
	  setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
	  setAnchorEl(null);
	};
	return (
		<Fragment>
			<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
				<Tooltip title="Pong Game">
					<IconButton
						onClick={handleClick}
						size="small"
						sx={{ ml: 2 }}
						aria-controls={open ? 'pong-game' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
					>
						<img src={pongIcon} className="menu_button" alt="Pong"/>
					</IconButton>
					
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="pong-game"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
          			},
      			}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      		>
				<MenuItem>
					Spec a match
				</MenuItem>
				<MenuItem>
					Play
				</MenuItem>
    		</Menu>
		</Fragment>
	);
}

export class MyMenu extends React.Component {
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
			<div style={{width: 500}}>
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