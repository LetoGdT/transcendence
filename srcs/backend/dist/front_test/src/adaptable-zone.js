"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PleaseConnect = exports.Stats = exports.SpecAMatch = exports.Profile = exports.Play = exports.MatchHistory = exports.Home = exports.Friends = exports.Chat = void 0;
require("./App.css");
const React = require("react");
const Button_1 = require("@mui/material/Button");
const Stack_1 = require("@mui/material/Stack");
function Chat() {
    return (<div>
			<h1>Chat</h1>
		</div>);
}
exports.Chat = Chat;
function Friends() {
    return (<div>
			Friends
			si user non connecter renvoyer vers /pleaseconnect
		</div>);
}
exports.Friends = Friends;
function Home() {
    return (<div>
			<h1>Home</h1>
		</div>);
}
exports.Home = Home;
function MatchHistory() {
    return (<div>
			MatchHistory
			si user non connecter renvoyer vers /pleaseconnect
		</div>);
}
exports.MatchHistory = MatchHistory;
function Play() {
    return (<div>
			Play
		</div>);
}
exports.Play = Play;
function Profile() {
    return (<div>
			Profile ou settings
			si user non connecter renvoyer vers /pleaseconnect
		</div>);
}
exports.Profile = Profile;
function SpecAMatch() {
    return (<div>
			SpecAMatch
		</div>);
}
exports.SpecAMatch = SpecAMatch;
function Stats() {
    return (<div>
			Stats (du user ou d'un friends)
			si user non connecter renvoyer vers /pleaseconnect
		</div>);
}
exports.Stats = Stats;
function PleaseConnect() {
    return (<div className='App'>
			You have not logged in yet please connect or register.
			<Stack_1.default direction="column" justifyContent="center" spacing={0.5}>
				<Button_1.default variant="text" size='small'>Sign On</Button_1.default>
				<Button_1.default variant="text" size='small'>Log In</Button_1.default>
			</Stack_1.default>
		</div>);
}
exports.PleaseConnect = PleaseConnect;
//# sourceMappingURL=adaptable-zone.js.map