import React from 'react';
import ReactDOM from 'react-dom';

import EscalaComponent from './EscalaComponent';

export default function main(params) { 
	 ReactDOM.render(
		<EscalaComponent />, 
		document.getElementById(params.portletElementId)
	);
}
