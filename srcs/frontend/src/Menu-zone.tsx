import './App.css'
import './Menu.css'

import * as React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons/faTableTennisPaddleBall';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@mui/material/IconButton';

import { Link } from 'react-router-dom'

export function OurMenu() {
	const [anchorElHome, setAnchorElHome] = React.useState<null | HTMLElement>(null);
	const [anchorElPong, setAnchorElPong] = React.useState<null | HTMLElement>(null);
	const [anchorElChat, setAnchorElChat] = React.useState<null | HTMLElement>(null);
	const [anchorElProfile, setAnchorElProfile] = React.useState<null | HTMLElement>(null);

	const openHome = Boolean(anchorElHome);
	const openPong = Boolean(anchorElPong);
	const openChat = Boolean(anchorElChat);
	const openProfile = Boolean(anchorElProfile);
	const handleClickHome = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElHome(event.currentTarget);
	};
	// const handleCloseHome = () => {
	// 	setAnchorElHome(null);
	// };
	const handleClickPong = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElPong(event.currentTarget);
	};
	const handleClosePong = () => {
		setAnchorElPong(null);
	};
	const handleClickChat = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElChat(event.currentTarget);
	};
	// const handleCloseChat = () => {
	// 	setAnchorElChat(null);
	// };
	const handleClickProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElProfile(event.currentTarget);
	};
	const handleCloseProfile = () => {
		setAnchorElProfile(null);
	};

	return (
		<div>
		<Link to="/">
			<IconButton
				sx={{fontSize:"2.5rem"}}
				size="large"
				aria-controls={openHome ? 'home-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={openHome ? 'true' : undefined}
				onClick={handleClickHome}
			>
				<FontAwesomeIcon icon={faHouse} />
			</IconButton>
		</Link>
		{/**
		<Menu
			id="home-menu"
			anchorEl={anchorElHome}
			open={openHome}
			onClose={handleCloseHome}
			MenuListProps={{
			'aria-labelledby': 'basic-button',
			}}
		>
			<Link to="/">
				<MenuItem onClick={handleCloseHome}>Nothing in home</MenuItem>
			</Link>
		</Menu>
		*/}
		<IconButton
			sx={{fontSize:"2.5rem"}}
			size="large"
			aria-controls={openPong ? 'pong-menu' : undefined}
			aria-haspopup="true"
			aria-expanded={openPong  ? 'true' : undefined}
			onClick={handleClickPong}
		>
			<FontAwesomeIcon icon={faTableTennisPaddleBall} />
		</IconButton>
		<Menu
			id="pong-menu"
			anchorEl={anchorElPong}
			open={openPong}
			onClose={handleClosePong}
			MenuListProps={{
			'aria-labelledby': 'basic-button',
			}}
		>
			<Link to="/specamatch">
				<MenuItem onClick={handleClosePong}>Spec a match</MenuItem>
			</Link>
			<Link to="/play">
				<MenuItem onClick={handleClosePong}>Play</MenuItem>
			</Link>
		</Menu>
		<Link to="/chat">
			<IconButton
				sx={{fontSize:"2.5rem"}}
				size="large"
				aria-controls={openChat ? 'chat-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={openChat ? 'true' : undefined}
				onClick={handleClickChat}
				>
				<FontAwesomeIcon icon={faComments} />
			</IconButton>
		</Link>
		{/**
		<Menu
			id="chat-menu"
			anchorEl={anchorElChat}
			open={openChat}
			onClose={handleCloseChat}
			MenuListProps={{
				'aria-labelledby': 'basic-button',
			}}
		>
			<Link to="/chat">
				<MenuItem onClick={handleCloseChat}>Nothing in Chat</MenuItem>
			</Link>
		</Menu>
		*/}
		<IconButton
			sx={{fontSize:"2.5rem"}}
			size="large"
			aria-controls={openProfile ? 'profile-menu' : undefined}
			aria-haspopup="true"
			aria-expanded={openProfile ? 'true' : undefined}
			onClick={handleClickProfile}
		>
			<FontAwesomeIcon icon={faUser} />
		</IconButton>
		<Menu
			id="profile-menu"
			anchorEl={anchorElProfile}
			open={openProfile}
			onClose={handleCloseProfile}
			MenuListProps={{
			'aria-labelledby': 'basic-button',
			}}
		>
			<Link to="/friends">
				<MenuItem onClick={handleCloseProfile}>Friends</MenuItem>
			</Link>
			<Link to="/profile">
				<MenuItem onClick={handleCloseProfile}>Profile</MenuItem>
			</Link>
			<Link to="/matchhistory">
				<MenuItem onClick={handleCloseProfile}>Match history</MenuItem>
			</Link>
			<Link to="/settings">
				<MenuItem onClick={handleCloseProfile}>Settings</MenuItem>
			</Link>
		</Menu>
		</div>
	);
}

