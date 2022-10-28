import { Fragment } from 'react'
import homeIcon from './assets/house-solid.svg'
import pongIcon from './assets/pong-solid.svg'
import profileIcon from './assets/user-solid.svg'
import chatIcon from './assets/comment-solid.svg'
import { useState } from 'react'
import './App.css'
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
  const handleCloseHome = () => {
    setAnchorElHome(null);
  };
  const handleClickPong = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPong(event.currentTarget);
  };
  const handleClosePong = () => {
    setAnchorElPong(null);
  };
  const handleClickChat = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElChat(event.currentTarget);
  };
  const handleCloseChat = () => {
    setAnchorElChat(null);
  };
  const handleClickProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProfile(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={openHome ? 'home-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openHome ? 'true' : undefined}
        onClick={handleClickHome}
      >
        Home
      </Button>
      <Menu
        id="home-menu"
        anchorEl={anchorElHome}
        open={openHome}
        onClose={handleCloseHome}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleCloseHome}>Nothing in home</MenuItem>
      </Menu>
      <Button
        id="basic-button"
        aria-controls={openPong ? 'pong-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openPong  ? 'true' : undefined}
        onClick={handleClickPong}
      >
        Pong
      </Button>
      <Menu
        id="pong-menu"
        anchorEl={anchorElPong}
        open={openPong}
        onClose={handleClosePong}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClosePong}>Spec a match</MenuItem>
        <MenuItem onClick={handleClosePong}>Play</MenuItem>
      </Menu>
      <Button
        id="basic-button"
        aria-controls={openChat ? 'chat-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openChat ? 'true' : undefined}
        onClick={handleClickChat}
      >
        Chat
      </Button>
      <Menu
        id="chat-menu"
        anchorEl={anchorElChat}
        open={openChat}
        onClose={handleCloseChat}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleCloseChat}>Nothing in Chat</MenuItem>
      </Menu>
      <Button
        id="basic-button"
        aria-controls={openProfile ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openProfile ? 'true' : undefined}
        onClick={handleClickProfile}
      >
        Profile
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorElProfile}
        open={openProfile}
        onClose={handleCloseProfile}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleCloseProfile}>Friends</MenuItem>
        <MenuItem onClick={handleCloseProfile}>Stats</MenuItem>
        <MenuItem onClick={handleCloseProfile}>Match history</MenuItem>
        <MenuItem onClick={handleCloseProfile}>Settings</MenuItem>
      </Menu>
    </div>
  );
}

