import './App.css';
import './SetPrivateGame.css';

import React from 'react';
import { useParams } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

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
    backgroundColor: '#52af77',
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
    backgroundColor: '#52af77',
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

export function SetPrivateGame(){
	let { uid } = useParams();

	return(
		<React.Fragment>
			<h1>Set Parameter for a Quick Play</h1>
			<div className='Set-Private-Game-container'>
				<div className='Set-Privaite-Game-Slider'>
				number of points needed to win the game
				<MaxPtsSlider
					valueLabelDisplay="auto"
					aria-label="number of points to win"
					min={5}
					max={20}
					defaultValue={10}
				/>
				</div>
				<div className='Set-Privaite-Game-Slider'>
				ball speed
				<BallSpeedSlider
					valueLabelDisplay="auto"
					aria-label="number of points to win"
					min={5}
					max={20}
					defaultValue={10}
				/>
				</div>
			</div>
		</React.Fragment>
	);
}