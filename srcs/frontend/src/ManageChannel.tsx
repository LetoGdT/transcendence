import './App.css';
import './ManageChannel.css';
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {Link, useParams} from 'react-router-dom';

import { NotFound } from './adaptable-zone';
import { getAllPaginated } from './tools';

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

type User = {
	id: number;
	username: string;
	image_url: string;
}

type Message = {
	id: number;
	content: string;
	sender: User;
}

type ChannelUser = {
	id: number;
	user: User;
	role: 'None' | 'Admin' | 'Owner';
	is_muted: Boolean;
	channel: Channel;
}

type ChannelBan = {
	id: number;
	user: User;
	unban_date: Date;
	channel: Channel;
}

type Channel = {
	id: number;
	name: string;
	users: ChannelUser[];
	messages: Message[];
	status: string;
	latest_sent: Date;
	ban_list: ChannelBan[];
	password: string;
}

export function ManageChannel(){
	let { cid } = useParams();
	const [me, setMe] = React.useState<User>();
	const [users, setUsers] = React.useState<ChannelUser[]>([]);
	const [isOwner, setIsOwner] = React.useState<boolean>(false);
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
	const [currentChannel, setCurrentChannel] = React.useState<Channel>();

	React.useEffect(() => {
		updateUsersMe();
	}, []);

	React.useEffect(() => {
		updateUsers();
		updateChannel();
	}, [cid]);

	React.useEffect(() => {
		users.forEach((elem: ChannelUser) => {
			if (elem.id === me?.id) {
				if (elem.role === 'Owner')
					setIsOwner(true);
				else if (elem.role === 'Admin')
					setIsAdmin(true);
			}
		});
	}, [users]);

	async function updateUsersMe() {
		await fetch("http://localhost:9999/api/users/me", {
			method: "GET",
			credentials: 'include'
		})
		.then(response=>response.json())
		.then(data => setMe(data));
	}

	async function updateUsers() {
		getAllPaginated(`channels/${cid}/users`)
		.then(data => setUsers(data));
	}

	async function updateChannel() {
		await fetch(`http://localhost:9999/api/channels/?id=${cid}`, {
			method: "GET",
			credentials: "include",
		})
		.then(response => response.json())
		.then(data => setCurrentChannel(data.data[0]));
	}

	function SelectStatus() {
		const handleClickSetPublic = async (event: React.MouseEvent<HTMLButtonElement>) => {
			await fetch(`http://localhost:9999/api/channels/${cid}`,{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({status: "public"})
			});
			window.location.reload();
		};

		const handleClickSetPrivate = async (event: React.MouseEvent<HTMLButtonElement>) => {
			await fetch(`http://localhost:9999/api/channels/${cid}`,{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({status: "private"})
			});
			window.location.reload();
		};

		const handleClickSetProtected = async (event: React.MouseEvent<HTMLButtonElement>) => {
			await fetch(`http://localhost:9999/api/channels/${cid}`,{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({status: "protected"})
			});
			window.location.reload();
		};

		if (currentChannel?.status === "public") {
			return(
				<React.Fragment>
					<div className='Manage-Channel-button'>
						<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetPrivate}>
							Set private
						</ManageChannelButton>
					</div>
					<div className='Manage-Channel-button'>
						<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetProtected}>
							Set protected
						</ManageChannelButton>
					</div>
				</React.Fragment>
			);
		} else if (currentChannel?.status === "private"){
			return(
				<React.Fragment>
					<div className='Manage-Channel-button'>
						<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetPublic}>
							Set public
						</ManageChannelButton>
					</div>
					<div className='Manage-Channel-button'>
						<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetProtected}>
							Set protected
						</ManageChannelButton>
					</div>
				</React.Fragment>
			);
		} else {
			return(
				<React.Fragment>
					<div className='Manage-Channel-button'>
						<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetPublic}>
							Set public
						</ManageChannelButton>
					</div>
					<div className='Manage-Channel-button'>
						<ManageChannelButton variant="contained" disableRipple onClick={handleClickSetPrivate}>
							Set private
						</ManageChannelButton>
					</div>
				</React.Fragment>
			);
		}
	}

	function OwnerPriv1() {
		const [password, setPassword] = React.useState("");
		
		const handleInputPwd = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setPassword(e.target.value);
		};

		const handleClickNewPwd = async (event: any) => {
			await fetch(`http://localhost:9999/api/channels/${cid}`, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({password: password, status: "protected"})
			});
			setPassword("");
			window.location.reload();
		}

		if (isOwner){
			return(
				<React.Fragment>
					<div className='Manage-Channel-container-div'>
						<div className='Manage-Channel-div'>
							<ManageChannelTextField
								label="New Password"
								InputLabelProps={{
								sx:{
									color:"white",
								}
								}}
								variant="outlined"
								sx={{ input: { color: 'grey' } }}
								id="validation-outlined-input"
								onChange={handleInputPwd}
								value={password}
							/>
						</div>
						<div className='Manage-Channel-button'>
							<ManageChannelButton variant="contained" disableRipple onClick={handleClickNewPwd}>
								Save Password
							</ManageChannelButton>
						</div>
					</div>
					<div className='Manage-Channel-container-div'>
						<div>
							Change status: 
						</div>
						<SelectStatus />
					</div>
				</React.Fragment>
			);
		} else {
			return(
				<React.Fragment></React.Fragment>
			);
		}
	}

	function DisplayUser(props: any){
		const [banTime, setBanTime] = React.useState("");
		
		const handleInputBanTime = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setBanTime(e.target.value);
		};

		const handleClickBan = async (event: React.MouseEvent<HTMLButtonElement>) => {
			await fetch(`http://localhost:9999/api/channels/${cid}/banlist`,{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({user_id: props?.user.user.id, unban_date: banTime})
			});
			setBanTime("");
			window.location.reload();
		}

		const handleClickKick = async (event: React.MouseEvent<HTMLButtonElement>) => {
			await fetch(`http://localhost:9999/api/channels/${cid}/users/${props?.user.id}`,{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'DELETE',
				credentials: 'include',
			});
			window.location.reload();
		}

		let url: string = "/otherprofile/";
		url = url.concat(props?.user.user.id.toString());
		return(
			<div className='Manage-Channel-container-div'>
				<Link to={url} >
					<div>
						<img src={props?.user.user.image_url} alt={props?.user.user.username + "'s avatar"} className='Profile-invitation-received-img'></img>
					</div>
					<div>{props?.user.user.username}</div>
				</Link>
				<div className='Manage-Channel-button'>
					<KickButton variant="contained" disableRipple onClick={handleClickKick}>
						Kick
					</KickButton>
				</div>
				<div className='Manage-Channel-container-subdiv'>
					<div>
						<ManageChannelTextField
							label="End date for banishing"
							InputLabelProps={{
							sx:{
								color:"white",
							}
							}}
							variant="outlined"
							sx={{ input: { color: 'grey' } }}
							id="validation-outlined-input"
							onChange={handleInputBanTime}
							value={banTime}
						/>
					</div>
					<div>
						format: yyyy-mm-dd hh:mm
					</div>
				</div>
				<div className='Manage-Channel-button'>
					<BanButton variant="contained" disableRipple onClick={handleClickBan}>
						Ban
					</BanButton>
				</div>
				<OwnerPriv2 user={props?.user}/>
			</div>
		);
	}

	function OwnerPriv2(props: any){

		const handleClickAdmin = async (event: React.MouseEvent<HTMLButtonElement>) => {
			await fetch(`http://localhost:9999/api/channels/${cid}/users/${props?.user.user.id}`,{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({role: "Admin"})
			});
			window.location.reload();
		}

		if(isOwner && props?.user.role === 'None'){
			return(
				<div className='Manage-Channel-button'>
					<ManageChannelButton variant="contained" disableRipple onClick={handleClickAdmin}>
						Make Admin
					</ManageChannelButton>
				</div>
			);
		} else {
			return(
				<React.Fragment>
				</React.Fragment>
			);
		}
	}

	// Main render 
	//
	//
	if (!(isOwner || isAdmin)){
		return(
			<NotFound />
		);
	} else {
		return(
			<React.Fragment>
				<h1>Channel {currentChannel?.name}'s management</h1>
				<div className='Manage-Channel-container'>
					<OwnerPriv1/>
					<h4>List of users</h4>
					{
						//recuperer la liste des users
						users?.map((user: ChannelUser) => {
							return(
								<DisplayUser user={user} />
							);
						})
					}
				</div>
			</React.Fragment>
		);
	}
}
