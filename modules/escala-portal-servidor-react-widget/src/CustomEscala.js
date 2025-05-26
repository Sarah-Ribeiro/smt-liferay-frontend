export default function CustomEscala() {
 return (
     <div style={{ fontSize: "12px", lineHeight: "1.2em" }}>
       <div><strong>{event.utilizer}</strong></div>
       <div>
         <strong>Início:</strong> {event.horarioInicio} -{" "}
         <strong>Fim:</strong> {event.horarioFim}
       </div>
       <div><strong>Período:</strong> {event.periodo}</div>
     </div>
   );
}