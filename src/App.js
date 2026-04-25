import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, ClipboardList, BarChart3, Plus, 
  Send, User, Calendar, MapPin, Tag, 
  CheckCircle2, Clock, AlertCircle, ChevronRight, ArrowLeft, UserX 
} from 'lucide-react';

const TIPOS = ["PRESENCIAL", "LIGAÇÃO", "WHATSAPP", "REUNIÃO ONLINE"];
const CARGOS = ["SUPERVISOR", "PLANEJADOR", "TÉCNICO", "LÍDER", "GERENTE", "COORDENADOR", "ENGENHEIRO", "COMPRADOR"];
const DEPTOS = ["MANUTENÇÃO GERAL", "PCM GERAL", "MANUTENÇÃO MECÂNICA", "MANUTENÇÃO ELÉTRICA", "GERAL", "PCM MECÂNICA", "COMPRAS", "ENGENHARIA", "PCM ELÉTRICA"];
const FOCOS = ["HIDRÁULICA", "ASCOVAL", "PNEUMÁTICA", "ELETRÔNICA", "GERAL", "GEMELS", "FILTROS"];
const NEGOCIOS = ["SERVICE INTERNO", "DISTRIBUIÇÃO", "SERVICE EXTERNO", "SISTEMAS", "TREINAMENTO"];
const CLASSIFICACOES = ["A", "B", "C", "D"];

// --- DADOS INICIAIS ---
const CLIENTES_INIT = [
  { id:1, nome:"BERNECK", cidade:"CURITIBA", classificacao:"A", status:"ativo", desde:"10/01/2024", motivo_inativo:"" },
  { id:2, nome:"GESTAMP", cidade:"SÃO JOSÉ DOS PINHAIS", classificacao:"A", status:"ativo", desde:"05/03/2024", motivo_inativo:"" },
  { id:9, nome:"INDÚSTRIAS NOBRE", cidade:"PONTA GROSSA", classificacao:"B", status:"inativo", desde:"10/05/2023", motivo_inativo:"Encerrou contrato" },
];

const CONTATOS_INIT = [
  { id:1, tipo:"PRESENCIAL", data:"22/04/2026", cliente:"BERNECK", cidade:"CURITIBA", contato:"GEOVANE SILVA", classificacao:"A", cargo:"COMPRADOR", depto:"COMPRAS", area:"LINHA 3", foco:"HIDRÁULICA", negocio:"DISTRIBUIÇÃO", feedback:"Cliente confirmou pedido." },
];

const TAREFAS_INIT = [
  { id:1, cliente:"GESTAMP", tipo:"PRESENCIAL", prazo:"Hoje", status:"atrasado", classificacao:"A", obs:"Retorno sobre orçamento" },
];

// --- COMPONENTES AUXILIARES ---
const statusColor = { atrasado:"#E24B4A", hoje:"#BA7517", pendente:"#639922", feita:"#888780" };
const statusBg = { atrasado:"#FCEBEB", hoje:"#FAEEDA", pendente:"#EAF3DE", feita:"#F1EFE8" };
const classColor = { A:{bg:"#EAF3DE",text:"#27500A"}, B:{bg:"#E6F1FB",text:"#0C447C"}, C:{bg:"#FAEEDA",text:"#633806"}, D:{bg:"#FCEBEB",text:"#A32D2D"} };
const tipoIcon = { PRESENCIAL:"🏢", LIGAÇÃO:"📞", WHATSAPP:"💬", "REUNIÃO ONLINE":"🖥️" };

function Badge({ label, bg, color, size=11 }) {
  return <span style={{ fontSize:size, fontWeight:500, padding:"2px 8px", borderRadius:20, background:bg, color, whiteSpace:"nowrap", display:"inline-block" }}>{label}</span>;
}

function Avatar({ initials, bg="#EEEDFE", color="#3C3489", size=36 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.35, fontWeight:500, flexShrink:0 }}>{initials}</div>;
}

// --- APP PRINCIPAL ---
export default function App() {
  const [tela, setTela] = useState("tarefas");
  const [contatos, setContatos] = useState(CONTATOS_INIT);
  const [tarefas, setTarefas] = useState(TAREFAS_INIT);
  const [clientes, setClientes] = useState(CLIENTES_INIT);

  return (
    <div style={{ maxWidth:420, margin:"0 auto", height:"100vh", display:"flex", flexDirection:"column", background:"#fff", border:"1px solid #ddd" }}>
      <div style={{ padding:16, borderBottom:"1px solid #eee" }}>
        <h1 style={{ fontSize:18, fontWeight:"bold" }}>CRM Follow-up</h1>
        <p style={{ fontSize:12, color:"#666" }}>Versão Beta Online</p>
      </div>

      <div style={{ flex:1, padding:16, overflowY:"auto" }}>
        {tela === "tarefas" && (
          <div>
            <h3>Tarefas Pendentes ({tarefas.filter(t=>t.status!=="feita").length})</h3>
            {tarefas.map(t => (
              <div key={t.id} style={{ padding:12, border:"1px solid #eee", borderRadius:8, marginBottom:8 }}>
                <strong>{t.cliente}</strong> - {t.obs}
              </div>
            ))}
          </div>
        )}
        {tela === "chat" && <div style={{ textAlign:"center", padding:20 }}>Chat IA ativado. Pronto para ouvir.</div>}
      </div>

      <nav style={{ display:"flex", borderTop:"1px solid #eee", padding:10 }}>
        <button onClick={()=>setTela("tarefas")} style={{ flex:1, background:"none", border:"none" }}>📋 Tarefas</button>
        <button onClick={()=>setTela("chat")} style={{ flex:1, background:"none", border:"none" }}>💬 Chat</button>
      </nav>
    </div>
  );
}
