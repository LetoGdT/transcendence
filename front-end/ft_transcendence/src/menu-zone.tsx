
import './App.css'

import * as React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons/faTableTennisPaddleBall';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';

type FontAwesomeSvgIconProps = {
  icon: any;
};

const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
  (props, ref) => {
    const { icon } = props;

    const {
      icon: [width, height, , , svgPathData],
    } = icon;

    return (
      <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
        {typeof svgPathData === 'string' ? (
          <path d={svgPathData} />
        ) : (
          /**
           * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
           * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
           * of a duotone icon. 40% is the default opacity.
           *
           * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
           */
          svgPathData.map((d: string, i: number) => (
            <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
          ))
        )}
      </SvgIcon>
    );
  },
);

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
      <IconButton
        size="large"
        aria-controls={openHome ? 'home-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openHome ? 'true' : undefined}
        onClick={handleClickHome}
      >
        <FontAwesomeIcon icon={faHouse} />
      </IconButton>
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
	  <IconButton
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
        <MenuItem onClick={handleClosePong}>Spec a match</MenuItem>
        <MenuItem onClick={handleClosePong}>Play</MenuItem>
      </Menu>
	  <IconButton
        size="large"
        aria-controls={openChat ? 'chat-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openChat ? 'true' : undefined}
        onClick={handleClickChat}
      >
        <FontAwesomeIcon icon={faComments} />
      </IconButton>
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
	  <IconButton
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
        <MenuItem onClick={handleCloseProfile}>Friends</MenuItem>
        <MenuItem onClick={handleCloseProfile}>Stats</MenuItem>
        <MenuItem onClick={handleCloseProfile}>Match history</MenuItem>
        <MenuItem onClick={handleCloseProfile}>Settings</MenuItem>
      </Menu>
    </div>
  );
}

