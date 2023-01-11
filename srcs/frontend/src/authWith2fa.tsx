import './App.css'

import * as React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CodeOf2FATextField = styled(TextField)({
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

const SettingsButton = styled(Button)({
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

const SendButton = styled(Button)({
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

export function AuthWith2FA(): React.ReactElement{
	const [code2FA, setCode2FA] = React.useState("");
	const [error, setError] = React.useState("");

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCode2FA(e.target.value);
	};

	const handleSend = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const response = await fetch('http://localhost:9999/api/2fa/authenticate',{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({code: code2FA})
		})
		.then(response => {
			if (!response.ok)
				return response.json();
			return null;
		})
		.then(data => setError(data != null ? data.message : null));
	}
	
	return(
		<React.Fragment>
			<h1>2FA</h1>
			{ error && <h3 className="error"> { error } </h3> }
			<CodeOf2FATextField
				label="6 digits code"
				InputLabelProps={{
					sx:{
						color:"white",
					}
				}}
				variant="outlined"
				// defaultValue="000000"
				sx={{ input: {color: "grey"} }}
				id="validation-outlined-input"
				onChange={handleInput}
			/>
			<SendButton variant="contained" disableRipple onClick={
				handleSend
			}>Send</SendButton>
		</React.Fragment>
	);
}