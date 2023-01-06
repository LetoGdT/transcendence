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


function SendCode2FA(code2FA: string | undefined){
	React.useEffect(() => {
		const api = async () => {
			const response = await fetch('http://localhost:9999/api/2fa/enable',{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({code: code2FA})
			});
		};

	}, []);	
}

export function Activate2FA(): React.ReactElement{
	const [code2FA, setCode2FA] = React.useState("");

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCode2FA(e.target.value);
		console.log(code2FA);//
		// SendCode2FA(code2FA);
	};
	
	return(
		<React.Fragment>
			<h1>2FA</h1>
			<img className='transparent' src='http://localhost:9999/api/2fa/generate' alt='QR code'></img>
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
		</React.Fragment>
	);
}