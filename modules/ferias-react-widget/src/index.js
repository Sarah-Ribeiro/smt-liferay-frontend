import React from 'react';
import ReactDOM from 'react-dom';

import FeriasPortlet from './FeriasPortlet';

export default function main(params) { 
	 ReactDOM.render(
		<FeriasPortlet />, 
		document.getElementById(params.portletElementId)
	);
}
