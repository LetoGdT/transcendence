import './App.css';
import './SetChannel.css';
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const SetChannelTextField = styled(TextField)({
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

const SetChannelButton = styled(Button)({
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

export function SetChannel(){
	const [name, setName] = React.useState("");
	const [password, setPassword] = React.useState("");

	const handleInputName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setName(e.target.value);
	};

	const handleInputPsw = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPassword(e.target.value);
	};

	const handleClickSetChannel = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const body = JSON.stringify({name, password});
		await fetch(`http://localhost:9999/api/channels/`, {
			method: "POST",
			credentials: "include",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body,
		});
	};

    return(
		<React.Fragment>
			<h1>Set Channel's parameters</h1>
			<div className='SetChannel-container'>
				<div className='SetChannel-container-div'>
					<div className='SetChannel-TextField'>
						<SetChannelTextField
							label="Name"
							InputLabelProps={{
							sx:{
								color:"white",
							}
							}}
							variant="outlined"
							defaultValue=""
							sx={{ input: { color: 'grey' } }}
							id="validation-outlined-input"
							onChange={handleInputName}
							value={name}
						/>
					</div>
					<div className='SetChannel-TextField'>
						<SetChannelTextField
							label="Password (optional)"
							InputLabelProps={{
								sx:{
									color:"white",
							}
							}}
							variant="outlined"
							defaultValue=""
							sx={{ input: { color: 'grey' } }}
							id="validation-outlined-input"
							onChange={handleInputPsw}
							value={password}
						/>
					</div>
				</div>
				<div className='SetChannel-button'><SetChannelButton variant="contained" disableRipple onClick={handleClickSetChannel}>Create Channel</SetChannelButton></div>
			</div>
		</React.Fragment>
    );
}
