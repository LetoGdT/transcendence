import './App.css';
import './SetChannel.css';
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {Link, useParam} from 'react-router-dom';

import { NotFound } from './adaptable-zone';

type userProps = {
	id: number;
	username: string;
	image_url: string;
}

const ManageChannelTextField = styled(TextField)({
	'& input:valid + fieldset': {
		borderColor: 'white',
		borderWidth: 2,
	},
	'& input:invalid + fieldset': {
		borderColor: 'red',
		borderWidth: 2,
	},
	'& input:valid:focus + fieldset': {
		borderLeftWidth: 6,
		padding: '4px !important', // override inline-style
	},
});

const ManageChannelButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#3b9b3b',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#4a7a4a',
		borderColor: '#646464',
	},
	'&:focus': {
		xShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

const KickButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#646464',
	borderColor: '#646464',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#bb1d03',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#891d03',
		borderColor: '#646464',
	},
	'&:focus': {
		boxShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},  
});

const BanButton = styled(Button)({
	boxShadow: 'none',
	textTransform: 'none',
	fontSize: 16,
	padding: '6px 12px',
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: '#bb1d03',
	borderColor: '#646464',
	color: '#000000',
	fontWeight: 'bold',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
	'&:hover': {
		backgroundColor: '#000000',
		color: '#bb1d03',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#891d03',
		borderColor: '#646464',
	},
	'&:focus': {
		boxShadow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},  
});

function SelectStatus(){

	const handleClickSetPublic = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('?',{//a changer
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			// body: JSON.stringify({image_url: newPass})//a changer
		});
	}

	const handleClickSetPrivate = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('?',{//a changer
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			// body: JSON.stringify({image_url: newPass})//a changer
		});
	}
	
	const handleClickSetProtected = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('?',{//a changer
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			// body: JSON.stringify({image_url: newPass})//a changer
		});
	}

	if (channel.status === "public"){
		return(
			<React.Fragment>
				<div className='Manage-Channel-button'>
					<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetPrivate}>Set private</ManageChannelButton><
				</div>
				<div className='Manage-Channel-button'>
					<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetProtected}>Set protected</ManageChannelButton><
				</div>
			</React.Fragment>
		);
	} else if (channel.status === "private"){
		return(
			<React.Fragment>
				<div className='Manage-Channel-button'>
					<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetPublic}>Set public</ManageChannelButton><
				</div>
				<div className='Manage-Channel-button'>
					<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetProtected}>Set protected</ManageChannelButton><
				</div>
			</React.Fragment>
		);
	} else {
		return(
			<React.Fragment>
				<div className='Manage-Channel-button'>
					<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetPublic}>Set public</ManageChannelButton><
				</div>
				<div className='Manage-Channel-button'>
					<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetPrivate}>Set private</ManageChannelButton><
				</div>
			</React.Fragment>
		);
	}
}

function OwnerPriv1(){
	const [password, setPassword] = React.useState("");
	
	const handleInputPwd = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPassword(e.target.value);
	};

	const handleClickNewPwd = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('?',{//a changer
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			// body: JSON.stringify({image_url: newPass})//a changer
		});
	}

	if (/*me === owner*/){
		return(
			<React.Fragment>
				<div className='Manage-Channel-container-div'>
					<div>
						New Password:
					</div>
					<div>
						<Box
							component="form"
							noValidate
							sx={{
								display: 'grid',
								gap: 2,
							}}
						>
							<ManageChannelTextField
								label="New Password"
								InputLabelProps={{
								sx:{
									color:"white",
								}
								}}
								variant="outlined"
								defaultValue=""
								sx={{ input: { color: 'grey' } }}
								id="validation-outlined-input"
								onChange={handleInputPwd}
							/>
						</Box>
					</div>
					<div className='Manage-Channel-button'>
						<ManageChannelButton variant="contained" disableRipple onClick={handleClickNewPwd}>Save Password</ManageChannelButton><
					</div>
				</div>
				<div className='Manage-Channel-container-div'>
					<div>
						Change status: 
					</div>
					<div>
						<SelectStatus />
					</div>
				</div>
			</React.Fragment>
		);
	} else {
		return(
			<React.Fragment></React.Fragment>
		);
	}
}

function DisplayUser(user:any){
	const [banTime, setBanTime] = React.useState("");
	
	//recup les infos du user
	
	const handleInputBanTime = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setBanTime(e.target.value);
	};

	const handleClickBan = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('?',{//a changer
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			// body: JSON.stringify({image_url: newPass})//a changer
		});
	}

	const handleClickKick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('?',{//a changer
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			// body: JSON.stringify({image_url: newPass})//a changer
		});
	}

	let url: string = "/otherprofile/";
	url = url.concat(user.id.toString());
	return(
		<div className='Manage-Channel-container-div'>
			<Link to={url} >
				<div>
					<img src={user.image_url} alt={user.username + "'s avatar"} className='Profile-invitation-received-img'></img>
				</div>
				<div>{user.username}</div>
			</Link>
			<div className='Manage-Channel-button'><KickButton variant="contained" disableRipple onClick={handleClickKick}>Kick</KickButton></div>
			<div className='Manage-Channel-container-subdiv'>
				<div>
					For banishing, please enter an end date
				</div>
				<div>
					<Box
						component="form"
						noValidate
						sx={{
							display: 'grid',
							gap: 2,
						}}
					>
						<ManageChannelTextField
							label="Ban Time"
							InputLabelProps={{
							sx:{
								color:"white",
							}
							}}
							variant="outlined"
							defaultValue=""
							sx={{ input: { color: 'grey' } }}
							id="validation-outlined-input"
							onChange={handleInputBanTime}
						/>
					</Box>
				</div>
			</div>
			<div className='Manage-Channel-button'><BanButton variant="contained" disableRipple onClick={handleClickBan}>Ban</BanButton></div>
			<OwnerPriv2 />
		</div>
	);
}

function OwnerPriv2(){

	const handleClickAdmin = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('?',{//a changer
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			credentials: 'include',
			// body: JSON.stringify({image_url: newPass})//a changer
		});
	}

	if(/*me === owner*/){
		return(
			<div className='Manage-Channel-button'><ManageChannelButton variant="contained" disableRipple onClick={handleClickAdmin}>Make Admin</ManageChannelButton></div>
		);
	} else {
		return(
			<React.Fragment></React.Fragment>
		);
	}
}


export function ManageChannel(){
	let { cid } = useParam();
	const [me, setMe] = React.useState<userProps>();

	React.useEffect(() => {
		const api = async () => {
			const data = await fetch("http://localhost:9999/api/users/isconnected", {
				method: "GET",
				credentials: 'include'
			});
			const jsonData = await data.json();
			setMe(jsonData);
		};
		
		//recuperer les info du channel dont id est cid
	
		api();
	}, []);

	// if (/*me n'est pas admin ou owner*/){
	// 	return(
	// 		<NotFound />
	// 	);
	// } else {
		return(
			<React.Fragment>
				<h1>Channel {channel?.name}'s management</h1>
				<div className='Manage-Channel-container'>
					<OwnerPriv1 />
					<h4>List of users</h4>
					{
						//recuperer la liste des users
						users.length > 0 && users?.map((user:any) => {
							return(
								<DisplayUser user={user} />
							);
						})
					}
				</div>
			</React.Fragment>
		);
	// }
}