import './App.css';
import './SetChannel.css';
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { NotFound } from './adaptable-zone';
import { userStatus } from './tools';

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

export function ManageChannel(){
	let { cid } = React.useParam();
	const [me, setMe] = React.useState<userProps>();
	const [password, setPassword] = React.useState("");


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

	// if (/*me n'est pas admin*/){
	// 	return(
	// 		<NotFound />
	// 	);
	// } else {
		return(
			<React.Fragment>
				<h1>Channel {channel?.name}'s management</h1>
				<div className='Manage-Channel-container'>
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

/*
	modifier le status
	modifier en psw
	ban ou kick un user
	set un user comme admin
*/