"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurHeader = void 0;
require("./App.css");
const React = require("react");
const Button_1 = require("@mui/material/Button");
const Stack_1 = require("@mui/material/Stack");
function AvatarZone() {
    let isLogIn = false;
    if (isLogIn === false) {
        return (<React.Fragment>
				<Stack_1.default direction="column" justifyContent="center" spacing={0.5}>
					<Button_1.default variant="text" size='small'>Sign On</Button_1.default>
					<Button_1.default variant="text" size='small'>Log In</Button_1.default>
				</Stack_1.default>
			</React.Fragment>);
    }
    else {
        return (<React.Fragment>
				<Stack_1.default direction="column" justifyContent="center" spacing={0.5}>
					recup avatar
					<Button_1.default variant="text" size='small'>Log Out</Button_1.default>

				</Stack_1.default>
			</React.Fragment>);
    }
}
function OurHeader() {
    return (<div className='Header'>
			<div>
				bannière
			</div>
			<div>
				<AvatarZone />
			</div>
		</div>);
}
exports.OurHeader = OurHeader;
//# sourceMappingURL=header-zone.js.map