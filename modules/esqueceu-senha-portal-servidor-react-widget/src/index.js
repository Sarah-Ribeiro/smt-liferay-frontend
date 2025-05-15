import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import EsqueceuASenhaComponent from './EsqueceuASenhaComponent';

/**
 * This is the main entry point of the portlet.
 *
 * See https://tinyurl.com/js-ext-portlet-entry-point for the most recent 
 * information on the signature of this function.
 *
 * @param  {Object} params a hash with values of interest to the portlet
 * @return {void}
 */
export default function main(params) { 
	 ReactDOM.render(
		<BrowserRouter>
		 <EsqueceuASenhaComponent />
		</BrowserRouter>,
		document.getElementById(params.portletElementId)
	);
}
