"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurMenu = void 0;
require("./App.css");
const React = require("react");
const Menu_1 = require("@mui/material/Menu");
const MenuItem_1 = require("@mui/material/MenuItem");
const faHouse_1 = require("@fortawesome/free-solid-svg-icons/faHouse");
const faTableTennisPaddleBall_1 = require("@fortawesome/free-solid-svg-icons/faTableTennisPaddleBall");
const faComments_1 = require("@fortawesome/free-solid-svg-icons/faComments");
const faUser_1 = require("@fortawesome/free-solid-svg-icons/faUser");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const IconButton_1 = require("@mui/material/IconButton");
const react_router_dom_1 = require("react-router-dom");
function OurMenu() {
    const [anchorElHome, setAnchorElHome] = React.useState(null);
    const [anchorElPong, setAnchorElPong] = React.useState(null);
    const [anchorElChat, setAnchorElChat] = React.useState(null);
    const [anchorElProfile, setAnchorElProfile] = React.useState(null);
    const openHome = Boolean(anchorElHome);
    const openPong = Boolean(anchorElPong);
    const openChat = Boolean(anchorElChat);
    const openProfile = Boolean(anchorElProfile);
    const handleClickHome = (event) => {
        setAnchorElHome(event.currentTarget);
    };
    const handleCloseHome = () => {
        setAnchorElHome(null);
    };
    const handleClickPong = (event) => {
        setAnchorElPong(event.currentTarget);
    };
    const handleClosePong = () => {
        setAnchorElPong(null);
    };
    const handleClickChat = (event) => {
        setAnchorElChat(event.currentTarget);
    };
    const handleCloseChat = () => {
        setAnchorElChat(null);
    };
    const handleClickProfile = (event) => {
        setAnchorElProfile(event.currentTarget);
    };
    const handleCloseProfile = () => {
        setAnchorElProfile(null);
    };
    return (<div>
		<react_router_dom_1.Link to="/">
			<IconButton_1.default sx={{ fontSize: "2.5rem" }} size="large" aria-controls={openHome ? 'home-menu' : undefined} aria-haspopup="true" aria-expanded={openHome ? 'true' : undefined} onClick={handleClickHome}>
				<react_fontawesome_1.FontAwesomeIcon icon={faHouse_1.faHouse}/>
			</IconButton_1.default>
		</react_router_dom_1.Link>
		
		<IconButton_1.default sx={{ fontSize: "2.5rem" }} size="large" aria-controls={openPong ? 'pong-menu' : undefined} aria-haspopup="true" aria-expanded={openPong ? 'true' : undefined} onClick={handleClickPong}>
			<react_fontawesome_1.FontAwesomeIcon icon={faTableTennisPaddleBall_1.faTableTennisPaddleBall}/>
		</IconButton_1.default>
		<Menu_1.default id="pong-menu" anchorEl={anchorElPong} open={openPong} onClose={handleClosePong} MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}>
			<react_router_dom_1.Link to="/specamatch">
				<MenuItem_1.default onClick={handleClosePong}>Spec a match</MenuItem_1.default>
			</react_router_dom_1.Link>
			<react_router_dom_1.Link to="/play">
				<MenuItem_1.default onClick={handleClosePong}>Play</MenuItem_1.default>
			</react_router_dom_1.Link>
		</Menu_1.default>
		<react_router_dom_1.Link to="/chat">
			<IconButton_1.default sx={{ fontSize: "2.5rem" }} size="large" aria-controls={openChat ? 'chat-menu' : undefined} aria-haspopup="true" aria-expanded={openChat ? 'true' : undefined} onClick={handleClickChat}>
				<react_fontawesome_1.FontAwesomeIcon icon={faComments_1.faComments}/>
			</IconButton_1.default>
		</react_router_dom_1.Link>
		
		<IconButton_1.default sx={{ fontSize: "2.5rem" }} size="large" aria-controls={openProfile ? 'profile-menu' : undefined} aria-haspopup="true" aria-expanded={openProfile ? 'true' : undefined} onClick={handleClickProfile}>
			<react_fontawesome_1.FontAwesomeIcon icon={faUser_1.faUser}/>
		</IconButton_1.default>
		<Menu_1.default id="profile-menu" anchorEl={anchorElProfile} open={openProfile} onClose={handleCloseProfile} MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}>
			<react_router_dom_1.Link to="/friends">
				<MenuItem_1.default onClick={handleCloseProfile}>Friends</MenuItem_1.default>
			</react_router_dom_1.Link>
			<react_router_dom_1.Link to="/stats">
				<MenuItem_1.default onClick={handleCloseProfile}>Stats</MenuItem_1.default>
			</react_router_dom_1.Link>
			<react_router_dom_1.Link to="/matchhistory">
				<MenuItem_1.default onClick={handleCloseProfile}>Match history</MenuItem_1.default>
			</react_router_dom_1.Link>
			<react_router_dom_1.Link to="/profile">
				<MenuItem_1.default onClick={handleCloseProfile}>Settings</MenuItem_1.default>
			</react_router_dom_1.Link>
		</Menu_1.default>
		</div>);
}
exports.OurMenu = OurMenu;
//# sourceMappingURL=menu-zone.js.map