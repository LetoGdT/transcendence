import './App.css'

import * as React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

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

export function AuthWith2FA(){
	let Code2FA: string | undefined;	

	// const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
	// 	console.log("handleInput");
	// 	let newCode: string;
	// 	newCode = e.target.value; 
	// 	console.log(newCode);
	// };

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
				onSubmit={(e: React.SyntheticEvent) => {
					e.preventDefault();
					const target = e.target as typeof e.target & {
					  code2FA: { value: string };
					};
					Code2FA = target.code2FA.value;
				}}
			/>
			<p>Result : {Code2FA}</p>
		</React.Fragment>
	);
}