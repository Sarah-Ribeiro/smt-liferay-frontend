import React from 'react';
import ReactDOM from 'react-dom';
import CalendarPortlet from './CalendarPortlet';

export default function main(params) {
	ReactDOM.render(
		<CalendarPortlet />,
		document.getElementById(params.portletElementId)
	);
}