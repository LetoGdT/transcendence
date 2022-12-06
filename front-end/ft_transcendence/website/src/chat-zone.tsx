import './App.css'
import './Chat.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';

import scrollImg from './scroll-img.png';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

// export const Scrollbar = ({
// 	children,
// 	className,
// 	...props
// }: React.ComponentPropsWithoutRef<'div'>) => {
// 	const contentRef = useRef<HTMLDivElement>(null);
// 	const scrollTrackRef = useRef<HTMLDivElement>(null);
// 	const scrollThumbRef = useRef<HTMLDivElement>(null);
// 	const observer = useRef<ResizeObserver | null>(null);
// 	const [thumbHeight, setThumbHeight] = useState(20);
// 	const [scrollStartPosition, setScrollStartPosition] = useState<number | null>(
//     	null
// 	);
// 	const [initialScrollTop, setInitialScrollTop] = useState<number>(0);
// 	const [isDragging, setIsDragging] = useState(false);

// 	function handleResize(ref: HTMLDivElement, trackSize: number) {
// 		const { clientHeight, scrollHeight } = ref;
// 		setThumbHeight(Math.max((clientHeight / scrollHeight) * trackSize, 20));
// 	}

// 	function handleScrollButton(direction: 'up' | 'down') {
// 		const { current } = contentRef;
// 		if (current) {
// 			const scrollAmount = direction === 'down' ? 200 : -200;
// 			current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
// 		}
// 	}

// 	const handleTrackClick = useCallback(
// 		(e: any) => {
// 			e.preventDefault();
// 			e.stopPropagation();
// 			const { current: trackCurrent } = scrollTrackRef;
// 			const { current: contentCurrent } = contentRef;
// 			if (trackCurrent && contentCurrent) {
// 				const { clientY } = e;
// 				const target = e.target as HTMLDivElement;
// 				const rect = target.getBoundingClientRect();
// 				const trackTop = rect.top;
// 				const thumbOffset = -(thumbHeight / 2);
// 				const clickRatio =
// 					(clientY - trackTop + thumbOffset) / trackCurrent.clientHeight;
// 				const scrollAmount = Math.floor(
// 					clickRatio * contentCurrent.scrollHeight
// 				);
// 				contentCurrent.scrollTo({
// 					top: scrollAmount,
// 					behavior: 'smooth',
// 				});
// 			}
// 		},
// 		[thumbHeight]
// 	);

// 	const handleThumbPosition = useCallback(() => {
// 		if (
// 			!contentRef.current ||
// 			!scrollTrackRef.current ||
// 			!scrollThumbRef.current
// 		) {
// 			return;
// 		}
// 			const { scrollTop: contentTop, scrollHeight: contentHeight } =
// 				contentRef.current;
// 			const { clientHeight: trackHeight } = scrollTrackRef.current;
// 			let newTop = (+contentTop / +contentHeight) * trackHeight;
// 			newTop = Math.min(newTop, trackHeight - thumbHeight);
// 			const thumb = scrollThumbRef.current;
// 			thumb.style.top = `${newTop}px`;
// 	}, []);

// 	const handleThumbMousedown = useCallback((e: any) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		setScrollStartPosition(e.clientY);
// 		if (contentRef.current) setInitialScrollTop(contentRef.current.scrollTop);
// 		setIsDragging(true);
// 	}, []);

// 	const handleThumbMouseup = useCallback(
// 		(e: any) => {
// 			e.preventDefault();
// 			e.stopPropagation();
// 			if (isDragging) {
// 				setIsDragging(false);
// 			}
// 		},
// 		[isDragging]
// 	);

// 	const handleThumbMousemove = useCallback(
// 		(e: any) => {
// 			e.preventDefault();
// 			e.stopPropagation();
// 			if (isDragging) {
// 				const {
// 					scrollHeight: contentScrollHeight,
// 					offsetHeight: contentOffsetHeight,
// 				} = contentRef.current;

// 				const deltaY =
// 					(e.clientY - scrollStartPosition) *
// 					(contentOffsetHeight / thumbHeight);
// 				const newScrollTop = Math.min(
// 					initialScrollTop + deltaY,
// 					contentScrollHeight - contentOffsetHeight
// 				);

// 				contentRef.current.scrollTop = newScrollTop;
// 			}
// 		},
// 		[isDragging, scrollStartPosition, thumbHeight]
// 	);

//   // If the content and the scrollbar track exist, use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
// 	useEffect(() => {
// 		if (contentRef.current && scrollTrackRef.current) {
// 			const ref = contentRef.current;
// 			const { clientHeight: trackSize } = scrollTrackRef.current;
// 			observer.current = new ResizeObserver(() => {
// 				handleResize(ref, trackSize);
// 			});
// 			observer.current.observe(ref);
// 			ref.addEventListener('scroll', handleThumbPosition);
// 			return () => {
// 				observer.current?.unobserve(ref);
// 				ref.removeEventListener('scroll', handleThumbPosition);
// 			};
// 		}
// 	}, []);

//   // Listen for mouse events to handle scrolling by dragging the thumb
// 	useEffect(() => {
// 		document.addEventListener('mousemove', handleThumbMousemove);
// 		document.addEventListener('mouseup', handleThumbMouseup);
// 		document.addEventListener('mouseleave', handleThumbMouseup);
// 		return () => {
// 			document.removeEventListener('mousemove', handleThumbMousemove);
// 			document.removeEventListener('mouseup', handleThumbMouseup);
// 			document.removeEventListener('mouseleave', handleThumbMouseup);
// 		};
// 	}, [handleThumbMousemove, handleThumbMouseup]);

// 	return (
// 		<div className="custom-scrollbars__container">
// 			<div className="custom-scrollbars__content" ref={contentRef} {...props}>
// 				{/* contiendra l'historique du chat */}
// 				{children}
// 			</div>
// 			<div className="custom-scrollbars__scrollbar">
// 				<button
// 					className="custom-scrollbars__button"
// 					onClick={() => handleScrollButton('up')}
// 				>
// 					⇑
// 				</button>
// 				<div className="custom-scrollbars__track-and-thumb">
// 					<div
// 						className="custom-scrollbars__track"
// 						ref={scrollTrackRef}
// 						onClick={handleTrackClick}
// 						style={{ cursor: isDragging && 'grabbing' }}
// 					></div>
// 					<div
// 						className="custom-scrollbars__thumb"
// 						ref={scrollThumbRef}
// 						onMouseDown={handleThumbMousedown}
// 						style={{
// 							height: `${thumbHeight}px`,
// 							cursor: isDragging ? 'grabbing' : 'grab',
// 						}}
// 					></div>
// 				</div>
// 				<button
// 					className="custom-scrollbars__button"
// 					onClick={() => handleScrollButton('down')}
// 				>
// 					⇓
// 				</button>
// 			</div>
// 		</div>
// 	);
// };

const MessageTextField = styled(TextField)({
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

export function Chat(){
	return(
		<div>
			<h1>Chat</h1>
			<div className='Chat-container'>
				<div className='Chat-navigate'>
					<div>channel 1</div>
					<div>channel 2</div>
					<div>Amigo 1</div>
				</div>
				<div>
					<div className='Chat-history-container'>
						<div className='Chat-history'>
							
						</div>
						<div>
							<img src={scrollImg} alt='waiting from scroll'></img>
						</div>
					</div>
					<div className='Chat-TextField'>
						<div>
							{/* <Box
								sx={{
									display: 'grid',
									gap: 2,
									maxWidth: '100%',
									width: 500
								}}
							> */}
								<MessageTextField
									label="Message"
									fullWidth
									InputLabelProps={{
									sx:{
										color:"white",
									}
									}}
									required
									variant="outlined"
									defaultValue="message"
									sx={{ input: { color: 'grey' } }}
									id="validation-outlined-input"
								/>
							{/* </Box> */}
						</div>
						<div className='Chat-send-button'>
							<SendButton variant="contained" disableRipple>Send</SendButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}