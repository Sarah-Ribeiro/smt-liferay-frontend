import React from 'react';
import ReactDOM from 'react-dom';
import InformacoesUsuario from './InformacoesUsuario';
export default function main(params) { 
	 ReactDOM.render(
		<InformacoesUsuario />, 
		document.getElementById(params.portletElementId)
	);
}
