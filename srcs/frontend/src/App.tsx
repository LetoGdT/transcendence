import React from 'react';
import './App.css';
import './Menu.css';

import { OurHeader } from './Header-zone';
import { OurMenu } from './Menu-zone';
import { Home } from './adaptable-zone';
import { Play, SpecAMatch} from './adaptable-zone';
import { ChatZone } from './Chat-zone';
import { FriendsZone } from './Friend-zone';
import { MatchHistory } from './MatchHistory-zone';
import { SettingsZone } from './Settings-zone';
import { ProfileZone, OtherProfile } from './Profile-zone';
import { SignOn } from './adaptable-zone';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'

// type resultProps = {
// 	data: [];
// }

// export function ListUser(){//vouer à disparaitre
// 	const [data, setResult] = useState<resultProps>();
	
// 	useEffect(() => {
// 		const api = async () => {
// 			let urltofetch : string;
// 			urltofetch = `http://localhost:9999/api/users/`;
// 			const data = await fetch(urltofetch, {
// 				method: "GET",
// 				credentials: 'include'
// 			});
// 			const jsonData = await data.json();
// 			setResult(jsonData);
// 		};
	
// 		api();
// 	}, []);
// 	return(
// 		<div>
// 			{data?.data.map((user: any) => {
// 				var url: string = "/otherprofile";
// 				url = url.concat("/");
// 				url = url.concat(user.id);
// 				return(

// 					<div>
// 						<Link to={url} >
// 							{user.uid}
// 						</Link>
// 					</div>
// 				);
// 			})}
// 		</div>
// 	);
// }

type resultProps = {
	data: [];
	meta : {
		page: number;
		take: number;
		itemCount: number;
		pageCount: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

export function ListUser(){//vouer à disparaitre
	const [data, setResult] = useState<resultProps>();
	
	let users: any[];
	let pagecount: number | undefined;
	
	useEffect(() => {
		const api = async () => {
			let urltofetch : string;
			urltofetch = `http://localhost:9999/api/users`;
			var data = await fetch(urltofetch, {
				method: "GET",
				credentials: 'include'
			});
			var jsonData = await data.json();
			setResult(jsonData);

			// console.log(jsonData.meta);
			pagecount = data?.meta.pageCount;
			// for (let i = 1; i < pagecount; i++){
				urltofetch = `http://localhost:9999/api/users/?`;
				var data = await fetch(urltofetch 
					+ new URLSearchParams({
					page: '1',//i.toString(), 
				})
					, {
					method: "GET",
					credentials: 'include'
				});
				var jsonData = await data.json();
				setResult(jsonData);
				users = users.concat(data?.data);
			// }
		};
	
		api();
	}, []);
	

	// for (let i = 1; i < pagecount; i++){
	// 	useEffect(() => {
	// 		const api = async () => {
	// 			let urltofetch : string;
	// 			urltofetch = `http://localhost:9999/api/users/?`;
	// 			const data = await fetch(urltofetch 
	// 				+ new URLSearchParams({
	// 				page: i.toString(), 
	// 			})
	// 				, {
	// 				method: "GET",
	// 				credentials: 'include'
	// 			});
	// 			const jsonData = await data.json();
	// 			setResult(jsonData);
	// 		};
		
	// 		api();
	// 	}, []);
	// 	users = users.concat(data?.data);
	// }
	
	return(
		<div>
			{/* <div>
				{pagecount}
			</div> */}
			{data?.data.map((user: any) => {
				var url: string = "/otherprofile";
				url = url.concat("/");
				url = url.concat(user.id);
				return(

					<div>
						<Link to={url} >
							{user.username}
						</Link>
					</div>
				);
			})}
		</div>
	);
}


function App() {
  return (
	<React.Fragment>
			<Router>
				<header>
					<OurHeader/>
				</header>
				<div className='Menu'>
					<OurMenu/>
				</div>
				<div className='Adaptable'>
					
					<Routes>
						<Route path="/chat" element={<ChatZone/>} />
						<Route path="/friends" element={<FriendsZone/>} />
						<Route path="/" element={<Home />} />
						<Route path="/matchhistory" element={<MatchHistory/>} />
						<Route path="/play" element={<Play/>} />
						<Route path="/settings" element={<SettingsZone/>} />
						<Route path="/specamatch" element={<SpecAMatch/>} />
						<Route path="/otherprofile/">
							<Route path=':uid' element={<OtherProfile />} />
						</Route>
						<Route path="/profile" element={<ProfileZone/>} />
						<Route path="/signon" element={<SignOn/>} />
						<Route path='/ListUser' element={<ListUser />} />
					</Routes>
				</div>
			</Router>

	</React.Fragment>
	
  );
}

export default App;


