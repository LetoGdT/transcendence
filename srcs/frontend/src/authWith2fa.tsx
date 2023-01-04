import './App.css'

import * as React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import { useState, useEffect } from "react";
// import {FormContainer, TextFieldElement} from 'react-hook-form-mui'

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
let newCode: string;

export function AuthWith2FA(): React.ReactElement{
	const [code2FA, setCode2FA] = useState(undefined);
	// let Code2FA: string | undefined;	

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("handleInput");
		console.log(e);
		setCode2FA(e.target.value);
		console.log(code2FA);
	};

	return(
		<React.Fragment>
			<h1>2FA</h1>
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
				// onInput={(e: React.FormEvent<HTMLInputElement>) => handleInput(e)}
				onChange={handleInput}
				// onChange={(e: React.SyntheticEvent) => {
				// 	e.preventDefault();
				// 	const target = e.target as typeof e.target & {
				// 	  Code2FA: { value: string };
				// 	};
				// 	Code2FA = target.Code2FA.value;
				// }}
			/>
			<p>Result : {newCode}</p>
		</React.Fragment>
	);
}