import './App.css';
import './SetPrivateGame.css';
import { socket } from './WebsocketContext';

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import { PleaseConnect } from './adaptable-zone';

const MaxPtsSlider = styled(Slider)({
  color: '#3b9b3b',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#3b9b3b',
	color: '#faebd7',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const BallSpeedSlider = styled(Slider)({
  color: '#007dd6',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#007dd6',
	color: '#faebd7',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const AskButton = styled(Button)({
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
		backgroundColor: '#007dd6',
		borderColor: '#646464',
		boxShadow: 'none',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#004d7b',
		borderColor: '#646464',
	},
	'&:focus': {
		adow: '0 0 0 0.2rem rgba(0,0,0,.5)',
	},
});

function SetPrivateGame(){
	let { uid } = useParams();
	const navigate = useNavigate();
	const [newPts, setNewPts] = React.useState(10);
	const [newSpeed, setNewSpeed] = React.useState(10);

	const [ isCreatingGame, setCreatingGame ] = React.useState(false);

	const handleClickSetParams = async (event: React.MouseEvent<HTMLButtonElement>) => {
		if (isCreatingGame)
			return ;
		
		setCreatingGame(true);

		socket.emit('queue', {
			type: 'Quick play',
			ball_speed: newSpeed,
			winning_score: newPts,
			opponent_id: uid
		})
	};

	const onGameCreated = ({ game_id }: { game_id: number }) => {
		navigate(`/join/${game_id}`);
	};

	React.useEffect(() => {
		socket.on('gameCreated', onGameCreated);

		return () => {
			socket.off('gameCreated', onGameCreated);
		};
	}, []);

	const handleNewPts = (value: any) => {
		setNewPts(value);
	}

	const handleNewSpeed = (value: any) => {
		setNewSpeed(value);
	}

	return(
		<React.Fragment>
			<h1>Set Parameters for a Quick Play</h1>
			<div className='Set-Private-Game-container'>
				<div className='Set-Private-Game-Slider'>
				number of points needed to win the game
				<MaxPtsSlider
					valueLabelDisplay="auto"
					aria-label="number of points to win"
					min={5}
					max={20}
					defaultValue={10}
					onChangeCommitted={(_, v) => handleNewPts(v)}
				/>
				</div>
				<div className='Set-Private-Game-Slider'>
				ball speed
				<BallSpeedSlider
					valueLabelDisplay="auto"
					aria-label="number of points to win"
					min={5}
					max={20}
					defaultValue={10}
					onChangeCommitted={(_, v) => handleNewSpeed(v)}
				/>
				</div>
			</div>
			<div className='Set-Private-Game-Button'>
				<AskButton variant="contained" disableRipple onClick={handleClickSetParams} disabled={isCreatingGame}>
					Set Parameters
				</AskButton>
			</div>
		</React.Fragment>
	);
}

export function SetPGameZone(){
	const [me, setMe] = React.useState<Boolean>(false);

	React.useEffect(() => {
		const api = async () => {
			await fetch(`${process.env.REACT_APP_NESTJS_HOSTNAME}/api/users/isconnected`, {
				method: "GET",
				credentials: 'include'
			})
			.then((response) => {
				if (!response.ok)
					setMe(false);
				else
					setMe(true);
			});
		};
	
		api();
	}, []);
	
	const isLoggedIn = me;
	if (isLoggedIn){
		return (
			<SetPrivateGame />
		);
	}
	else 
	{
		return (
			<PleaseConnect />
		 );
	}
}
