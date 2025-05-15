import React from 'react';
import ReactDOM from 'react-dom';
import './css/styles.scss';

import AbrirDemandasComponent from './AbrirDemandasComponent';

export default function main(params) { 
	 ReactDOM.render(
		<AbrirDemandasComponent />, 
		document.getElementById(params.portletElementId)
	);
}
