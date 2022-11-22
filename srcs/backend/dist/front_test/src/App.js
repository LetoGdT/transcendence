"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
require("./App.css");
const menu_zone_1 = require("./menu-zone");
const adaptable_zone_1 = require("./adaptable-zone");
const adaptable_zone_2 = require("./adaptable-zone");
const adaptable_zone_3 = require("./adaptable-zone");
const adaptable_zone_4 = require("./adaptable-zone");
const adaptable_zone_5 = require("./adaptable-zone");
const react_router_dom_1 = require("react-router-dom");
const header_zone_1 = require("./header-zone");
function App() {
    return (<react_1.default.Fragment>
		<react_router_dom_1.BrowserRouter>
			<header>
				<header_zone_1.OurHeader />
			</header>
			<div className='Menu'>
				<menu_zone_1.OurMenu />
			</div>
			<div className='Adaptable'>

				<react_router_dom_1.Routes>
					<react_router_dom_1.Route path="/chat" element={<adaptable_zone_3.Chat />}/>
					<react_router_dom_1.Route path="/friends" element={<adaptable_zone_4.Friends />}/>
					<react_router_dom_1.Route path="/" element={<adaptable_zone_1.Home />}/>
					<react_router_dom_1.Route path="/matchhistory" element={<adaptable_zone_4.MatchHistory />}/>
					<react_router_dom_1.Route path="/play" element={<adaptable_zone_2.Play />}/>
					<react_router_dom_1.Route path="/profile" element={<adaptable_zone_4.Profile />}/>
					<react_router_dom_1.Route path="/specamatch" element={<adaptable_zone_2.SpecAMatch />}/>
					<react_router_dom_1.Route path="/stats" element={<adaptable_zone_4.Stats />}/>
					<react_router_dom_1.Route path="/pleaseconnect" element={<adaptable_zone_5.PleaseConnect />}/>
				</react_router_dom_1.Routes>
			</div>
		</react_router_dom_1.BrowserRouter>
	</react_1.default.Fragment>);
}
exports.default = App;
//# sourceMappingURL=App.js.map