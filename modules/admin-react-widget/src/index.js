import React from 'react';
import ReactDOM from 'react-dom';

import UserListComponent from './UserListComponent';

export default function main(params) { 
	 ReactDOM.render(
		<UserListComponent />, 
		document.getElementById(params.portletElementId)
	);
}
