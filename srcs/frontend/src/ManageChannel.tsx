import './App.css';
import './SetChannel.css';
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

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
	
		api();
	}, []);

	const handleInputPwd = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPassword(e.target.value);
	};

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
						<div>
						<ManageChannelButton variant="contained" disableRipple onClick={handleClickNew}>Save Password</ManageChannelButton><
						</div>
					</div>
					<div>
						
					</div>
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