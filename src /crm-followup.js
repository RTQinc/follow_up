import { useState, useRef, useEffect } from "react";

const TIPOS = ["PRESENCIAL", "LIGAÇÃO", "WHATSAPP", "REUNIÃO ONLINE"];
const CARGOS = ["SUPERVISOR", "PLANEJADOR", "TÉCNICO", "LÍDER", "GERENTE", "COORDENADOR", "ENGENHEIRO", "COMPRADOR"];
const DEPTOS = ["MANUTENÇÃO GERAL", "PCM GERAL", "MANUTENÇÃO MECÂNICA", "MANUTENÇÃO ELÉTRICA", "GERAL", "PCM MECÂNICA", "COMPRAS", "ENGENHARIA", "PCM ELÉTRICA"];
const FOCOS = ["HIDRÁULICA", "ASCOVAL", "PNEUMÁTICA", "ELETRÔNICA", "GERAL", "GEMELS", "FILTROS"];
const NEGOCIOS = ["SERVICE INTERNO", "DISTRIBUIÇÃO", "SERVICE EXTERNO", "SISTEMAS", "TREINAMENTO"];
const CLASSIFICACOES = ["A", "B", "C", "D"];

const CLIENTES_INIT = [
  { id:1, nome:"BERNECK", cidade:"CURITIBA", classificacao:"A", status:"ativo", desde:"10/01/2024", motivo_inativo:"" },
  { id:2, nome:"GESTAMP", cidade:"SÃO JOSÉ DOS PINHAIS", classificacao:"A", status:"ativo", desde:"05/03/2024", motivo_inativo:"" },
  { id:3, nome:"ELECTROLUX", cidade:"CURITIBA", classificacao:"A", status:"ativo", desde:"12/06/2023", motivo_inativo:"" },
  { id:4, nome:"ONE SUBSEA", cidade:"MACAÉ", classificacao:"A", status:"ativo", desde:"01/09/2023", motivo_inativo:"" },
  { id:5, nome:"DISTRIBUIDORA SUL", cidade:"MARINGÁ", classificacao:"B", status:"ativo", desde:"20/02/2025", motivo_inativo:"" },
  { id:6, nome:"METALÚRGICA OMEGA", cidade:"LONDRINA", classificacao:"B", status:"ativo", desde:"15/04/2024", motivo_inativo:"" },
  { id:7, nome:"CONSTRUTORA ABC", cidade:"CASCAVEL", classificacao:"C", status:"ativo", desde:"08/07/2024", motivo_inativo:"" },
  { id:8, nome:"FARMÁCIAS VIDA", cidade:"MARINGÁ", classificacao:"C", status:"ativo", desde:"30/10/2024", motivo_inativo:"" },
  { id:9, nome:"INDÚSTRIAS NOBRE", cidade:"PONTA GROSSA", classificacao:"B", status:"inativo", desde:"10/05/2023", motivo_inativo:"Encerrou contrato — mudança de fornecedor" },
];

const CONTATOS_INIT = [
  { id:1, tipo:"PRESENCIAL", data:"22/04/2026", cliente:"BERNECK", cidade:"CURITIBA", contato:"GEOVANE SILVA", classificacao:"A", cargo:"COMPRADOR", depto:"COMPRAS", area:"LINHA DE PRODUÇÃO 3", foco:"HIDRÁULICA", negocio:"DISTRIBUIÇÃO", feedback:"Cliente confirmou pedido de bombas hidráulicas para semana que vem. Tom positivo." },
  { id:2, tipo:"WHATSAPP", data:"21/04/2026", cliente:"GESTAMP", cidade:"SÃO JOSÉ DOS PINHAIS", contato:"MARCOS PEREIRA", classificacao:"A", cargo:"ENGENHEIRO", depto:"MANUTENÇÃO MECÂNICA", area:"PRENSAS", foco:"PNEUMÁTICA", negocio:"SERVICE EXTERNO", feedback:"Enviou fotos do cilindro com vazamento. Solicitou orçamento urgente para reparo." },
  { id:3, tipo:"LIGAÇÃO", data:"20/04/2026", cliente:"DISTRIBUIDORA SUL", cidade:"MARINGÁ", contato:"MARIA COSTA", classificacao:"B", cargo:"GERENTE", depto:"COMPRAS", area:"GERAL", foco:"GERAL", negocio:"DISTRIBUIÇÃO", feedback:"Interesse em renovar contrato anual. Pediu proposta atualizada com novos preços." },
  { id:4, tipo:"REUNIÃO ONLINE", data:"18/04/2026", cliente:"ELECTROLUX", cidade:"CURITIBA", contato:"ANA LIMA / ROBERTO SOUZA", classificacao:"A", cargo:"COORDENADOR", depto:"ENGENHARIA", area:"MONTAGEM", foco:"ELETRÔNICA", negocio:"SISTEMAS", feedback:"Apresentou novo sistema de automação. Equipe demonstrou interesse. Próximo passo: visita técnica." },
  { id:5, tipo:"PRESENCIAL", data:"15/04/2026", cliente:"METALÚRGICA OMEGA", cidade:"LONDRINA", contato:"JOÃO SANTOS", classificacao:"B", cargo:"SUPERVISOR", depto:"MANUTENÇÃO GERAL", area:"FUNDIÇÃO", foco:"FILTROS", negocio:"SERVICE INTERNO", feedback:"Revisão preventiva realizada. Identificou 3 filtros para troca. Orçamento enviado." },
];

const TAREFAS_INIT = [
  { id:1, cliente:"GESTAMP", tipo:"PRESENCIAL", prazo:"Hoje", status:"atrasado", classificacao:"A", obs:"Retorno sobre orçamento do cilindro" },
  { id:2, cliente:"DISTRIBUIDORA SUL", tipo:"WHATSAPP", prazo:"Hoje", status:"hoje", classificacao:"B", obs:"Enviar proposta de renovação" },
  { id:3, cliente:"ELECTROLUX", tipo:"PRESENCIAL", prazo:"26/04", status:"pendente", classificacao:"A", obs:"Visita técnica agendada" },
  { id:4, cliente:"METALÚRGICA OMEGA", tipo:"LIGAÇÃO", prazo:"28/04", status:"pendente", classificacao:"B", obs:"Aprovação do orçamento de filtros" },
  { id:5, cliente:"BERNECK", tipo:"PRESENCIAL", prazo:"30/04", status:"pendente", classificacao:"A", obs:"Confirmar entrega das bombas" },
];

const statusColor = { atrasado:"#E24B4A", hoje:"#BA7517", pendente:"#639922", feita:"#888780" };
const statusBg = { atrasado:"#FCEBEB", hoje:"#FAEEDA", pendente:"#EAF3DE", feita:"#F1EFE8" };
const classColor = { A:{bg:"#EAF3DE",text:"#27500A"}, B:{bg:"#E6F1FB",text:"#0C447C"}, C:{bg:"#FAEEDA",text:"#633806"}, D:{bg:"#FCEBEB",text:"#A32D2D"} };
const tipoIcon = { PRESENCIAL:"🏢", LIGAÇÃO:"📞", WHATSAPP:"💬", "REUNIÃO ONLINE":"🖥️" };

const inp = { width:"100%", fontSize:12, padding:"6px 8px", borderRadius:6, border:"0.5px solid var(--color-border-secondary)", background:"var(--color-background-primary)", color:"var(--color-text-primary)" };
const sel = { ...inp };

function Badge({ label, bg, color, size=11 }) {
  return <span style={{ fontSize:size, fontWeight:500, padding:"2px 8px", borderRadius:20, background:bg, color, whiteSpace:"nowrap", display:"inline-block" }}>{label}</span>;
}
function Avatar({ initials, bg="#EEEDFE", color="#3C3489", size=36 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.35, fontWeight:500, flexShrink:0 }}>{initials}</div>;
}
function getInitials(nome) { return nome.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }
function secLabel(txt, color="var(--color-text-secondary)", bg="var(--color-background-secondary)") {
  return <div style={{ fontSize:11, fontWeight:500, color, padding:"6px 16px 4px", textTransform:"uppercase", letterSpacing:"0.06em", background:bg }}>{txt}</div>;
}

// ─── MODAL NOVA TAREFA ────────────────────────────────────────────────────────
function ModalNovaTarefa({ clientes, onSalvar, onFechar }) {
  const [form, setForm] = useState({ cliente:"", tipo:"PRESENCIAL", obs:"", prazo:"" });
  function upd(k,v) { setForm(f=>({...f,[k]:v})); }
  const ativos = clientes.filter(c=>c.status==="ativo");
  const ok = form.cliente && form.tipo && form.prazo;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200 }} onClick={onFechar}>
      <div style={{ background:"var(--color-background-primary)", borderRadius:"16px 16px 0 0", padding:"20px 20px 32px", width:"100%", maxWidth:420 }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontSize:15, fontWeight:500 }}>Nova tarefa</span>
          <button onClick={onFechar} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"var(--color-text-secondary)", lineHeight:1 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div>
            <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginBottom:4 }}>Cliente *</div>
            <select value={form.cliente} onChange={e=>upd("cliente",e.target.value)} style={{ ...sel, fontSize:13, padding:"8px 10px" }}>
              <option value="">Selecione o cliente</option>
              {ativos.map(c=><option key={c.id} value={c.nome}>{c.nome} ({c.classificacao})</option>)}
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginBottom:4 }}>Tipo *</div>
              <select value={form.tipo} onChange={e=>upd("tipo",e.target.value)} style={{ ...sel, fontSize:13, padding:"8px 10px" }}>
                {TIPOS.map(t=><option key={t} value={t}>{tipoIcon[t]} {t}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginBottom:4 }}>Prazo *</div>
              <input type="date" value={form.prazo} onChange={e=>upd("prazo",e.target.value)} style={{ ...inp, fontSize:13, padding:"8px 10px" }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginBottom:4 }}>Observação</div>
            <input value={form.obs} onChange={e=>upd("obs",e.target.value)} placeholder="Ex: Apresentar proposta de renovação..." style={{ ...inp, fontSize:13, padding:"8px 10px" }} />
          </div>
          <button onClick={()=>{ if(!ok) return; const cl=ativos.find(c=>c.nome===form.cliente); onSalvar({ id:Date.now(), cliente:form.cliente, tipo:form.tipo, prazo:new Date(form.prazo).toLocaleDateString("pt-BR"), status:"pendente", classificacao:cl?.classificacao||"C", obs:form.obs||"Contato agendado" }); }} disabled={!ok}
            style={{ padding:"11px 0", background:ok?"#7F77DD":"var(--color-background-secondary)", color:ok?"#fff":"var(--color-text-secondary)", border:"none", borderRadius:10, fontSize:14, fontWeight:500, cursor:ok?"pointer":"default", marginTop:4 }}>
            Criar tarefa
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAINEL TAREFAS ───────────────────────────────────────────────────────────
function PainelTarefas({ tarefas, contatos, onCumprir, onVerCliente }) {
  const [showFeitas, setShowFeitas] = useState(false);
  const ativas = tarefas.filter(t=>t.status!=="feita");
  const feitas = tarefas.filter(t=>t.status==="feita");
  const atrasadas = ativas.filter(t=>t.status==="atrasado");
  const hoje = ativas.filter(t=>t.status==="hoje");
  const pendentes = ativas.filter(t=>t.status==="pendente");

  function TarefaRow({ t }) {
    const cl = classColor[t.classificacao]||classColor.C;
    const feita = t.status==="feita";
    return (
      <div style={{ display:"flex", alignItems:"stretch", borderBottom:"0.5px solid var(--color-border-tertiary)", background:feita?"var(--color-background-secondary)":"transparent" }}>
        {/* Botão cumprir */}
        <button
          title={feita?"Concluída":"Marcar como feita e detalhar"}
          onClick={e=>{ e.stopPropagation(); if(!feita) onCumprir(t); }}
          style={{ width:46, background:"none", border:"none", borderRight:"0.5px solid var(--color-border-tertiary)", cursor:feita?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, color:feita?"#639922":"#D3D1C7", transition:"all .15s" }}
          onMouseEnter={e=>{ if(!feita){ e.currentTarget.style.background="#EEEDFE"; e.currentTarget.style.color="#7F77DD"; }}}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=feita?"#639922":"#D3D1C7"; }}>
          {feita ? "✓" : "○"}
        </button>
        {/* Info */}
        <div onClick={()=>!feita&&onVerCliente(t.cliente)} style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"10px 12px", cursor:feita?"default":"pointer" }}
          onMouseEnter={e=>{ if(!feita) e.currentTarget.style.background="var(--color-background-secondary)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
          <div style={{ fontSize:18 }}>{tipoIcon[t.tipo]||"📋"}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:500, color:feita?"var(--color-text-secondary)":"var(--color-text-primary)", textDecoration:feita?"line-through":"none" }}>{t.cliente}</div>
            <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.obs}</div>
          </div>
          {!feita && <Badge label={t.classificacao} bg={cl.bg} color={cl.text}/>}
          <Badge label={feita?"Feita":t.prazo} bg={statusBg[t.status]} color={statusColor[t.status]}/>
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowY:"auto", height:"100%", maxHeight:"calc(100vh - 120px)" }}>
      {/* Métricas */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, padding:"16px 16px 10px" }}>
        {[{label:"Atrasadas",val:atrasadas.length,color:"#A32D2D",bg:"#FCEBEB"},{label:"Hoje",val:hoje.length,color:"#633806",bg:"#FAEEDA"},{label:"Semana",val:pendentes.length,color:"#27500A",bg:"#EAF3DE"}].map(m=>(
          <div key={m.label} style={{ background:m.bg, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:24, fontWeight:500, color:m.color }}>{m.val}</div>
            <div style={{ fontSize:11, color:m.color, marginTop:3 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Toggle feitas */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"2px 16px 8px" }}>
        <span style={{ fontSize:12, color:"var(--color-text-secondary)" }}>{feitas.length} concluída{feitas.length!==1?"s":""}</span>
        <button onClick={()=>setShowFeitas(s=>!s)} style={{ fontSize:12, color:"#534AB7", background:"none", border:"none", cursor:"pointer" }}>
          {showFeitas?"Ver pendentes":"Ver concluídas"}
        </button>
      </div>

      {!showFeitas && <>
        {atrasadas.length>0 && <>{secLabel("Atrasadas","#A32D2D","#FEF6F6")}{atrasadas.map(t=><TarefaRow key={t.id} t={t}/>)}</>}
        {hoje.length>0 && <>{secLabel("Para hoje","#633806","#FEFAF5")}{hoje.map(t=><TarefaRow key={t.id} t={t}/>)}</>}
        {pendentes.length>0 && <>{secLabel("Esta semana")}{pendentes.map(t=><TarefaRow key={t.id} t={t}/>)}</>}
        {ativas.length===0 && <div style={{ textAlign:"center", padding:"40px 16px", color:"var(--color-text-secondary)", fontSize:13 }}>Nenhuma tarefa pendente 🎉</div>}
      </>}
      {showFeitas && (feitas.length>0 ? feitas.map(t=><TarefaRow key={t.id} t={t}/>) : <div style={{ textAlign:"center", padding:"40px", color:"var(--color-text-secondary)", fontSize:13 }}>Nenhuma tarefa concluída ainda.</div>)}

      {/* Últimos contatos */}
      {!showFeitas && contatos.length>0 && (
        <div style={{ padding:"14px 16px 8px" }}>
          <div style={{ fontSize:12, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Últimos contatos</div>
          {contatos.slice(0,4).map(c=>{
            const cl=classColor[c.classificacao]||classColor.C;
            return <div key={c.id} onClick={()=>onVerCliente(c.cliente)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"0.5px solid var(--color-border-tertiary)", cursor:"pointer" }}>
              <Avatar initials={getInitials(c.cliente)} bg={cl.bg} color={cl.text} size={32}/>
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:500 }}>{c.cliente}</div><div style={{ fontSize:12, color:"var(--color-text-secondary)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{tipoIcon[c.tipo]} {c.tipo} · {c.data}</div></div>
              <Badge label={c.classificacao} bg={cl.bg} color={cl.text}/>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}

// ─── CHAT IA ──────────────────────────────────────────────────────────────────
function TelaChat({ onSalvar, onNovoCliente, onInativarCliente, clientes, tarefaContexto, onLimparContexto }) {
  const getMsg0 = (ctx) => ctx
    ? `Contato com ${ctx.cliente} (${ctx.tipo}) — ${ctx.obs}. Descreva como foi: o que discutiu, com quem e próximos passos.`
    : "Descreva um contato realizado, cadastre um novo cliente ou informe que quer inativar um cliente da carteira.";

  const [msgs, setMsgs] = useState([{ role:"assistant", content:getMsg0(tarefaContexto) }]);
  const [input, setInput] = useState(tarefaContexto ? `Realizei o contato ${tarefaContexto.tipo.toLowerCase()} com ${tarefaContexto.cliente}. ` : "");
  const [loading, setLoading] = useState(false);
  const [pendente, setPendente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, pendente]);

  const ativos = clientes.filter(c=>c.status==="ativo");

  async function enviar() {
    if (!input.trim()||loading) return;
    const msg = input.trim(); setInput("");
    setMsgs(prev=>[...prev,{role:"user",content:msg}]); setLoading(true);
    try {
      const hoje = new Date().toLocaleDateString("pt-BR");
      const ctx = tarefaContexto ? `Contexto: tarefa agendada — ${tarefaContexto.cliente} (${tarefaContexto.tipo}): ${tarefaContexto.obs}.` : "";
      const sys = `Assistente de CRM. Retorne APENAS JSON sem markdown.\n${ctx}\nIntenções:\n- registrar_contato: {"intencao":"registrar_contato","tipo":"PRESENCIAL|LIGAÇÃO|WHATSAPP|REUNIÃO ONLINE","data":"DD/MM/AAAA","cliente":"NOME","cidade":"","contato":"NOMES","classificacao":"A|B|C|D","cargo":"SUPERVISOR|PLANEJADOR|TÉCNICO|LÍDER|GERENTE|COORDENADOR|ENGENHEIRO|COMPRADOR","depto":"MANUTENÇÃO GERAL|PCM GERAL|MANUTENÇÃO MECÂNICA|MANUTENÇÃO ELÉTRICA|GERAL|PCM MECÂNICA|COMPRAS|ENGENHARIA|PCM ELÉTRICA","area":"texto ou GERAL","foco":"HIDRÁULICA|ASCOVAL|PNEUMÁTICA|ELETRÔNICA|GERAL|GEMELS|FILTROS","negocio":"SERVICE INTERNO|DISTRIBUIÇÃO|SERVICE EXTERNO|SISTEMAS|TREINAMENTO","feedback":"resumo 1-2 frases","proximo_passo":"próxima ação","proximo_prazo":7}\n- novo_cliente: {"intencao":"novo_cliente","nome":"NOME","cidade":"CIDADE","classificacao":"A|B|C|D","observacao":""}\n- inativar_cliente: {"intencao":"inativar_cliente","nome":"NOME","motivo":""}\nClientes ativos: ${ativos.map(c=>c.nome).join(", ")}\nHoje: ${hoje}`;
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:msg}]})});
      const data = await res.json();
      const parsed = JSON.parse(data.content?.[0]?.text?.replace(/```json|```/g,"").trim()||"{}");

      if (parsed.intencao==="registrar_contato") {
        const f = {...parsed, cliente:parsed.cliente||(tarefaContexto?.cliente||""), tipo:parsed.tipo||(tarefaContexto?.tipo||"")};
        setPendente({tipo:"contato"}); setForm(f);
        setMsgs(prev=>[...prev,{role:"assistant",content:"Extraí as informações. Confira e confirme antes de salvar."}]);
      } else if (parsed.intencao==="novo_cliente") {
        setPendente({tipo:"novo_cliente"}); setForm(parsed);
        setMsgs(prev=>[...prev,{role:"assistant",content:`Vou cadastrar ${parsed.nome} (Classe ${parsed.classificacao}). Confirme abaixo.`}]);
      } else if (parsed.intencao==="inativar_cliente") {
        const enc = ativos.find(c=>c.nome.includes(parsed.nome.split(" ")[0]));
        const d = {...parsed, nome:enc?.nome||parsed.nome};
        setPendente({tipo:"inativar"}); setForm(d);
        setMsgs(prev=>[...prev,{role:"assistant",content:`Inativar ${d.nome}? O histórico será preservado.`}]);
      } else {
        setMsgs(prev=>[...prev,{role:"assistant",content:"Não entendi. Exemplos: 'visitei a Berneck hoje', 'novo cliente Empresa X em Londrina classe B', 'inativar cliente Metalúrgica Omega'."}]);
      }
    } catch { setMsgs(prev=>[...prev,{role:"assistant",content:"Não consegui processar. Tente novamente."}]); }
    setLoading(false);
  }

  function confirmar() {
    if (pendente.tipo==="contato") { onSalvar({...form,id:Date.now()}); setMsgs([{role:"assistant",content:"Contato salvo! Pode registrar outro ou fazer outra ação."}]); }
    else if (pendente.tipo==="novo_cliente") { onNovoCliente({id:Date.now(),nome:form.nome,cidade:form.cidade,classificacao:form.classificacao,status:"ativo",desde:new Date().toLocaleDateString("pt-BR"),motivo_inativo:""}); setMsgs([{role:"assistant",content:`${form.nome} cadastrado!`}]); }
    else if (pendente.tipo==="inativar") { onInativarCliente(form.nome,form.motivo); setMsgs([{role:"assistant",content:`${form.nome} inativado. Histórico preservado.`}]); }
    setPendente(null); setForm({}); setEditando(false);
    if (onLimparContexto) onLimparContexto();
  }

  function cancelar() {
    setPendente(null); setForm({}); setEditando(false);
    setMsgs(prev=>[...prev,{role:"assistant",content:"Cancelado."}]);
    if (onLimparContexto) onLimparContexto();
  }

  function upd(k,v) { setForm(f=>({...f,[k]:v})); }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", maxHeight:"calc(100vh - 120px)" }}>
      {/* Banner contexto tarefa */}
      {tarefaContexto && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 16px", background:"#EEEDFE", borderBottom:"0.5px solid #AFA9EC", flexShrink:0 }}>
          <span style={{ fontSize:18 }}>{tipoIcon[tarefaContexto.tipo]}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:500, color:"#3C3489" }}>{tarefaContexto.cliente}</div>
            <div style={{ fontSize:11, color:"#534AB7" }}>{tarefaContexto.obs}</div>
          </div>
          <button onClick={()=>{ onLimparContexto(); setMsgs([{role:"assistant",content:"Contexto removido. Descreva livremente."}]); setInput(""); }} style={{ fontSize:11, color:"#534AB7", background:"none", border:"none", cursor:"pointer" }}>× remover</button>
        </div>
      )}

      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px" }}>
        {/* Sugestões */}
        {msgs.length===1 && !tarefaContexto && (
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
            {[["🏢","Registrar contato com cliente"],["➕","Cadastrar novo cliente"],["📦","Inativar cliente da carteira"]].map(([ic,s])=>(
              <button key={s} onClick={()=>setInput(s)} style={{ textAlign:"left", padding:"8px 12px", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:8, fontSize:13, color:"var(--color-text-secondary)", cursor:"pointer" }}>{ic} {s}</button>
            ))}
          </div>
        )}

        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:10 }}>
            <div style={{ maxWidth:"82%", padding:"9px 13px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?"#7F77DD":"var(--color-background-secondary)", color:m.role==="user"?"#fff":"var(--color-text-primary)", fontSize:13, lineHeight:1.5 }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ display:"flex",gap:5,padding:"8px 0 8px 4px" }}>{[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:"#AFA9EC",animation:`bounce 1.2s ${i*0.2}s infinite` }}/>)}</div>}

        {/* Card contato */}
        {pendente?.tipo==="contato" && (
          <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:12, padding:14, marginTop:8 }}>
            <div style={{ fontSize:12, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:10, display:"flex", justifyContent:"space-between" }}>
              <span>REGISTRO DE CONTATO</span>
              <button onClick={()=>setEditando(e=>!e)} style={{ fontSize:12, color:"#534AB7", background:"none", border:"none", cursor:"pointer" }}>{editando?"fechar":"editar"}</button>
            </div>
            {editando ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 12px" }}>
                {[{k:"tipo",label:"Tipo",opts:TIPOS},{k:"data",label:"Data"},{k:"cliente",label:"Cliente"},{k:"cidade",label:"Cidade"},{k:"contato",label:"Contato"},{k:"classificacao",label:"Classificação",opts:CLASSIFICACOES},{k:"cargo",label:"Cargo",opts:CARGOS},{k:"depto",label:"Depto",opts:DEPTOS},{k:"area",label:"Área"},{k:"foco",label:"Foco",opts:FOCOS},{k:"negocio",label:"Negócio",opts:NEGOCIOS}].map(({k,label,opts})=>(
                  <div key={k} style={{ gridColumn:["contato","area","foco","negocio"].includes(k)?"span 2":"span 1" }}>
                    <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginBottom:3 }}>{label}</div>
                    {opts?<select value={form[k]||""} onChange={e=>upd(k,e.target.value)} style={sel}><option value="">—</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input value={form[k]||""} onChange={e=>upd(k,e.target.value)} style={inp}/>}
                  </div>
                ))}
                <div style={{ gridColumn:"span 2" }}><div style={{ fontSize:11, color:"var(--color-text-secondary)", marginBottom:3 }}>Feedback</div><textarea value={form.feedback||""} onChange={e=>upd("feedback",e.target.value)} rows={3} style={{ ...inp, resize:"none" }}/></div>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 16px" }}>
                {[["Tipo",form.tipo,tipoIcon[form.tipo]],["Data",form.data],["Cliente",form.cliente],["Cidade",form.cidade],["Contato",form.contato],["Classificação",form.classificacao],["Cargo",form.cargo],["Depto",form.depto],["Área",form.area],["Foco",form.foco],["Negócio",form.negocio]].map(([label,val,icon])=>val?(
                  <div key={label} style={{ gridColumn:["Contato","Área","Foco","Negócio"].includes(label)?"span 2":"span 1", display:"flex", gap:6 }}>
                    <span style={{ fontSize:12, color:"var(--color-text-secondary)", flexShrink:0 }}>{label}:</span>
                    <span style={{ fontSize:12, fontWeight:500 }}>{icon?`${icon} `:""}{val}</span>
                  </div>
                ):null)}
                {form.feedback && <div style={{ gridColumn:"span 2", marginTop:4, padding:"7px 10px", background:"var(--color-background-secondary)", borderRadius:8, fontSize:12, lineHeight:1.5 }}>{form.feedback}</div>}
                {form.proximo_passo && <div style={{ gridColumn:"span 2", marginTop:4, display:"flex", gap:6 }}><span style={{ fontSize:11, color:"#534AB7", fontWeight:500 }}>Próximo:</span><span style={{ fontSize:12, color:"#3C3489" }}>{form.proximo_passo} ({form.proximo_prazo}d)</span></div>}
              </div>
            )}
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button onClick={confirmar} style={{ flex:1, padding:"9px 0", background:"#7F77DD", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer" }}>Salvar no Sheets</button>
              <button onClick={cancelar} style={{ padding:"9px 16px", background:"none", border:"0.5px solid var(--color-border-secondary)", borderRadius:8, fontSize:13, color:"var(--color-text-secondary)", cursor:"pointer" }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Card novo cliente */}
        {pendente?.tipo==="novo_cliente" && (
          <div style={{ background:"#E1F5EE", border:"0.5px solid #5DCAA5", borderRadius:12, padding:14, marginTop:8 }}>
            <div style={{ fontSize:12, fontWeight:500, color:"#085041", marginBottom:10 }}>NOVO CLIENTE</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 12px", marginBottom:12 }}>
              {[{k:"nome",label:"Nome"},{k:"cidade",label:"Cidade"},{k:"classificacao",label:"Classificação",opts:CLASSIFICACOES}].map(({k,label,opts})=>(
                <div key={k}><div style={{ fontSize:11, color:"#085041", marginBottom:3 }}>{label}</div>{opts?<select value={form[k]||""} onChange={e=>upd(k,e.target.value)} style={{ ...sel, border:"0.5px solid #9FE1CB", background:"#fff", color:"#085041" }}><option value="">—</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input value={form[k]||""} onChange={e=>upd(k,e.target.value)} style={{ ...inp, border:"0.5px solid #9FE1CB", background:"#fff", color:"#085041" }}/>}</div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={confirmar} style={{ flex:1, padding:"9px 0", background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer" }}>Cadastrar</button>
              <button onClick={cancelar} style={{ padding:"9px 16px", background:"none", border:"0.5px solid #9FE1CB", borderRadius:8, fontSize:13, color:"#085041", cursor:"pointer" }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Card inativar */}
        {pendente?.tipo==="inativar" && (
          <div style={{ background:"#FCEBEB", border:"0.5px solid #F09595", borderRadius:12, padding:14, marginTop:8 }}>
            <div style={{ fontSize:12, fontWeight:500, color:"#A32D2D", marginBottom:8 }}>INATIVAR CLIENTE</div>
            <div style={{ fontSize:13, color:"#791F1F", marginBottom:10 }}><strong>{form.nome}</strong> — histórico será preservado.</div>
            <div style={{ marginBottom:12 }}><div style={{ fontSize:11, color:"#A32D2D", marginBottom:3 }}>Motivo (opcional)</div><input value={form.motivo||""} onChange={e=>upd("motivo",e.target.value)} placeholder="Ex: encerrou contrato..." style={{ ...inp, border:"0.5px solid #F09595", background:"#fff", color:"#791F1F" }}/></div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={confirmar} style={{ flex:1, padding:"9px 0", background:"#E24B4A", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer" }}>Confirmar</button>
              <button onClick={cancelar} style={{ padding:"9px 16px", background:"none", border:"0.5px solid #F09595", borderRadius:8, fontSize:13, color:"#A32D2D", cursor:"pointer" }}>Cancelar</button>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div style={{ padding:"10px 16px 16px", borderTop:"0.5px solid var(--color-border-tertiary)", flexShrink:0 }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();enviar()}}} placeholder="Descreva o contato, cadastre ou inative um cliente..." rows={2} style={{ flex:1, padding:"9px 12px", borderRadius:10, border:"0.5px solid var(--color-border-secondary)", background:"var(--color-background-primary)", color:"var(--color-text-primary)", fontSize:13, resize:"none", lineHeight:1.5 }}/>
          <button onClick={enviar} disabled={loading||!input.trim()} style={{ padding:"9px 16px", background:input.trim()&&!loading?"#7F77DD":"var(--color-background-secondary)", color:input.trim()&&!loading?"#fff":"var(--color-text-secondary)", border:"none", borderRadius:10, fontSize:13, fontWeight:500, cursor:input.trim()&&!loading?"pointer":"default", transition:"all .2s", whiteSpace:"nowrap" }}>Enviar</button>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(.6)}40%{transform:scale(1)}}`}</style>
    </div>
  );
}

// ─── DETALHE CLIENTE ──────────────────────────────────────────────────────────
function DetalheCliente({ nomeCliente, contatos, clientes, onVoltar, onInativar, onReativar }) {
  const historico = contatos.filter(c=>c.cliente===nomeCliente);
  const info = clientes.find(c=>c.nome===nomeCliente);
  const cl = classColor[info?.classificacao]||classColor.C;
  const isInativo = info?.status==="inativo";
  const [resumo, setResumo] = useState(""); const [loadingR, setLoadingR] = useState(false);
  const [conf, setConf] = useState(null);

  async function gerarResumo() {
    setLoadingR(true);
    try {
      const hist = historico.map(c=>`${c.data}|${c.tipo}|${c.contato}|${c.foco}|${c.negocio}|${c.feedback}`).join("\n");
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{role:"user",content:`Resumo executivo em 3-4 frases sobre ${nomeCliente}: situação atual, assuntos recorrentes, oportunidades e próxima ação.\n\n${hist}`}]})});
      const d = await res.json(); setResumo(d.content?.[0]?.text||"");
    } catch { setResumo("Não foi possível gerar."); }
    setLoadingR(false);
  }

  return (
    <div style={{ overflowY:"auto", height:"100%", maxHeight:"calc(100vh - 120px)" }}>
      <div onClick={onVoltar} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 16px", borderBottom:"0.5px solid var(--color-border-tertiary)", cursor:"pointer", fontSize:13, color:"var(--color-text-secondary)" }}>← Voltar</div>
      <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"center", gap:12 }}>
        <Avatar initials={getInitials(nomeCliente)} bg={isInativo?"var(--color-background-secondary)":cl.bg} color={isInativo?"var(--color-text-secondary)":cl.text} size={44}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:500, display:"flex", alignItems:"center", gap:8 }}>{nomeCliente}{isInativo&&<span style={{ fontSize:10, padding:"1px 6px", borderRadius:20, background:"#F1EFE8", color:"#5F5E5A" }}>inativo</span>}</div>
          <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginTop:2 }}>{info?.cidade} · {historico.length} contatos</div>
          {isInativo&&info?.motivo_inativo&&<div style={{ fontSize:12, color:"#A32D2D", marginTop:2 }}>{info.motivo_inativo}</div>}
        </div>
        <Badge label={info?.classificacao||"?"} bg={cl.bg} color={cl.text} size={13}/>
      </div>
      <div style={{ padding:"0 16px 12px", display:"flex", gap:8 }}>
        {isInativo
          ? <button onClick={()=>setConf("reativar")} style={{ fontSize:12, padding:"6px 14px", background:"#E1F5EE", color:"#085041", border:"0.5px solid #9FE1CB", borderRadius:8, cursor:"pointer", fontWeight:500 }}>Reativar cliente</button>
          : <button onClick={()=>setConf("inativar")} style={{ fontSize:12, padding:"6px 14px", background:"#FCEBEB", color:"#A32D2D", border:"0.5px solid #F09595", borderRadius:8, cursor:"pointer", fontWeight:500 }}>Inativar cliente</button>}
      </div>
      {conf && (
        <div style={{ margin:"0 16px 12px", padding:12, borderRadius:10, background:conf==="inativar"?"#FCEBEB":"#E1F5EE", border:`0.5px solid ${conf==="inativar"?"#F09595":"#9FE1CB"}` }}>
          <div style={{ fontSize:13, color:conf==="inativar"?"#791F1F":"#085041", marginBottom:10 }}>{conf==="inativar"?`Confirma inativação de ${nomeCliente}? Histórico preservado.`:`Reativar ${nomeCliente} na carteira ativa?`}</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ conf==="inativar"?onInativar(nomeCliente,""):onReativar(nomeCliente); setConf(null); onVoltar(); }} style={{ padding:"7px 16px", background:conf==="inativar"?"#E24B4A":"#1D9E75", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer" }}>Confirmar</button>
            <button onClick={()=>setConf(null)} style={{ padding:"7px 12px", background:"none", border:`0.5px solid ${conf==="inativar"?"#F09595":"#9FE1CB"}`, borderRadius:8, fontSize:12, cursor:"pointer" }}>Cancelar</button>
          </div>
        </div>
      )}
      {historico.length>0 && (
        <div style={{ margin:"0 16px 14px", background:"#EEEDFE", border:"0.5px solid #AFA9EC", borderRadius:10, padding:12 }}>
          <div style={{ fontSize:11, fontWeight:500, color:"#534AB7", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Análise do Claude</div>
          {resumo?<div style={{ fontSize:13, color:"#3C3489", lineHeight:1.6 }}>{resumo}</div>:<button onClick={gerarResumo} disabled={loadingR} style={{ fontSize:12, color:"#534AB7", background:"rgba(255,255,255,0.5)", border:"0.5px solid #AFA9EC", borderRadius:6, padding:"6px 12px", cursor:"pointer" }}>{loadingR?"Analisando...":"Gerar resumo ↗"}</button>}
        </div>
      )}
      <div style={{ padding:"0 16px" }}>
        <div style={{ fontSize:12, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Histórico</div>
        {historico.length===0&&<div style={{ fontSize:13, color:"var(--color-text-secondary)", padding:"20px 0", textAlign:"center" }}>Nenhum contato registrado.</div>}
        {historico.map(c=>(
          <div key={c.id} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--color-background-secondary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{tipoIcon[c.tipo]}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ fontSize:13, fontWeight:500 }}>{c.tipo}</span><span style={{ fontSize:12, color:"var(--color-text-secondary)" }}>{c.data}</span></div>
              <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:4 }}>{c.contato} · {c.cargo} · {c.depto}</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:5 }}><Badge label={c.foco} bg="#EEEDFE" color="#3C3489"/><Badge label={c.negocio} bg="#E1F5EE" color="#085041"/>{c.area&&c.area!=="GERAL"&&<Badge label={c.area} bg="#F1EFE8" color="#444441"/>}</div>
              <div style={{ fontSize:12, lineHeight:1.5, background:"var(--color-background-secondary)", borderRadius:6, padding:"6px 8px" }}>{c.feedback}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TELA CLIENTES ────────────────────────────────────────────────────────────
function TelaClientes({ clientes, contatos, onVerCliente }) {
  const [filtro,setFiltro]=useState("ativo"); const [busca,setBusca]=useState("");
  const lista = clientes.filter(c=>c.status===filtro&&c.nome.includes(busca.toUpperCase()));
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", maxHeight:"calc(100vh - 120px)" }}>
      <div style={{ padding:"12px 16px 8px", flexShrink:0 }}>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar cliente..." style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:"0.5px solid var(--color-border-secondary)", background:"var(--color-background-secondary)", color:"var(--color-text-primary)", fontSize:13 }}/>
        <div style={{ display:"flex", marginTop:8, borderRadius:8, overflow:"hidden", border:"0.5px solid var(--color-border-tertiary)" }}>
          {["ativo","inativo"].map(f=><button key={f} onClick={()=>setFiltro(f)} style={{ flex:1, padding:"7px 0", background:filtro===f?"#7F77DD":"var(--color-background-secondary)", color:filtro===f?"#fff":"var(--color-text-secondary)", border:"none", fontSize:13, fontWeight:filtro===f?500:400, cursor:"pointer" }}>{f==="ativo"?`Ativos (${clientes.filter(c=>c.status==="ativo").length})`:`Inativos (${clientes.filter(c=>c.status==="inativo").length})`}</button>)}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        {lista.length===0&&<div style={{ fontSize:13, color:"var(--color-text-secondary)", textAlign:"center", padding:"40px 0" }}>Nenhum cliente {filtro}.</div>}
        {lista.map(c=>{
          const cl=classColor[c.classificacao]||classColor.C; const n=contatos.filter(ct=>ct.cliente===c.nome).length;
          return <div key={c.id} onClick={()=>onVerCliente(c.nome)} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 16px", borderBottom:"0.5px solid var(--color-border-tertiary)", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.background="var(--color-background-secondary)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Avatar initials={getInitials(c.nome)} bg={c.status==="inativo"?"var(--color-background-secondary)":cl.bg} color={c.status==="inativo"?"var(--color-text-secondary)":cl.text} size={38}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:6 }}>{c.nome}{c.status==="inativo"&&<span style={{ fontSize:10, padding:"1px 6px", borderRadius:20, background:"#F1EFE8", color:"#5F5E5A" }}>inativo</span>}</div>
              <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginTop:2 }}>{c.cidade} · {n} contato{n!==1?"s":""} · desde {c.desde}</div>
              {c.status==="inativo"&&c.motivo_inativo&&<div style={{ fontSize:11, color:"#A32D2D", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.motivo_inativo}</div>}
            </div>
            <Badge label={c.classificacao} bg={cl.bg} color={cl.text}/>
          </div>;
        })}
      </div>
    </div>
  );
}

// ─── PAINEL GESTÃO ────────────────────────────────────────────────────────────
function PainelGestao({ contatos, tarefas, clientes }) {
  const [resumo,setResumo]=useState(""); const [loading,setLoading]=useState(false);
  const ativos=clientes.filter(c=>c.status==="ativo"); const inativos=clientes.filter(c=>c.status==="inativo");
  const porTipo=TIPOS.map(t=>({tipo:t,count:contatos.filter(c=>c.tipo===t).length}));
  const porClass=CLASSIFICACOES.map(cl=>({cl,count:contatos.filter(c=>c.classificacao===cl).length}));
  const maxTipo=Math.max(...porTipo.map(p=>p.count),1);
  const atrasadas=tarefas.filter(t=>t.status==="atrasado").length;

  async function gerarResumo() {
    setLoading(true);
    try {
      const stats=`Ativos:${ativos.length},Inativos:${inativos.length},Contatos:${contatos.length},Atrasadas:${atrasadas},Tipos:${porTipo.map(p=>`${p.tipo}:${p.count}`).join(",")},Classes:${porClass.map(p=>`${p.cl}:${p.count}`).join(",")}`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,messages:[{role:"user",content:`Resumo executivo em 3-4 frases para gestor comercial: pontos positivos, alertas e ação prioritária.\n\n${stats}`}]})});
      const d=await res.json(); setResumo(d.content?.[0]?.text||"");
    } catch { setResumo("Não foi possível gerar."); }
    setLoading(false);
  }

  return (
    <div style={{ overflowY:"auto", height:"100%", maxHeight:"calc(100vh - 120px)", padding:"16px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
        {[{label:"Contatos semana",val:contatos.length,color:"#0C447C",bg:"#E6F1FB"},{label:"Atrasadas",val:atrasadas,color:"#A32D2D",bg:"#FCEBEB"},{label:"Clientes ativos",val:ativos.length,color:"#27500A",bg:"#EAF3DE"}].map(m=>(
          <div key={m.label} style={{ background:m.bg, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:500, color:m.color }}>{m.val}</div>
            <div style={{ fontSize:11, color:m.color, marginTop:3, lineHeight:1.3 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"#EEEDFE", border:"0.5px solid #AFA9EC", borderRadius:10, padding:12, marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:500, color:"#534AB7", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Análise Claude</div>
        {resumo?<div style={{ fontSize:13, color:"#3C3489", lineHeight:1.6 }}>{resumo}</div>:<button onClick={gerarResumo} disabled={loading} style={{ fontSize:12, color:"#534AB7", background:"rgba(255,255,255,0.5)", border:"0.5px solid #AFA9EC", borderRadius:6, padding:"6px 12px", cursor:"pointer" }}>{loading?"Analisando...":"Gerar resumo da semana ↗"}</button>}
      </div>
      <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:12, marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Por tipo de contato</div>
        {porTipo.map(p=>(
          <div key={p.tipo} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
            <span style={{ fontSize:16 }}>{tipoIcon[p.tipo]}</span>
            <span style={{ fontSize:12, color:"var(--color-text-secondary)", width:130, flexShrink:0 }}>{p.tipo}</span>
            <div style={{ flex:1, height:7, background:"var(--color-background-secondary)", borderRadius:4, overflow:"hidden" }}><div style={{ width:`${(p.count/maxTipo)*100}%`, height:"100%", background:"#7F77DD", borderRadius:4, transition:"width .4s" }}/></div>
            <span style={{ fontSize:12, color:"var(--color-text-secondary)", width:16, textAlign:"right" }}>{p.count}</span>
          </div>
        ))}
      </div>
      <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:12, marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Por classificação</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {porClass.map(p=>{const cl=classColor[p.cl];return <div key={p.cl} style={{ background:cl.bg, borderRadius:8, padding:"10px 8px", textAlign:"center" }}><div style={{ fontSize:20, fontWeight:500, color:cl.text }}>{p.count}</div><div style={{ fontSize:11, color:cl.text, marginTop:2 }}>Classe {p.cl}</div></div>;})}
        </div>
      </div>
      {inativos.length>0 && (
        <div style={{ background:"#F1EFE8", border:"0.5px solid #D3D1C7", borderRadius:10, padding:12 }}>
          <div style={{ fontSize:12, fontWeight:500, color:"#5F5E5A", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Carteira inativa ({inativos.length})</div>
          {inativos.map(c=><div key={c.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, padding:"5px 0", borderBottom:"0.5px solid #D3D1C7" }}><span style={{ fontWeight:500, color:"#444441" }}>{c.nome}</span><span style={{ color:"#888780", fontSize:11, maxWidth:"55%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.motivo_inativo||"—"}</span></div>)}
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [tela, setTela] = useState("tarefas");
  const [telaAnterior, setTelaAnterior] = useState("tarefas");
  const [clienteDetalhe, setClienteDetalhe] = useState(null);
  const [contatos, setContatos] = useState(CONTATOS_INIT);
  const [tarefas, setTarefas] = useState(TAREFAS_INIT);
  const [clientes, setClientes] = useState(CLIENTES_INIT);
  const [tarefaContexto, setTarefaContexto] = useState(null);
  const [showNovaTarefa, setShowNovaTarefa] = useState(false);

  function salvarContato(reg) {
    setContatos(prev=>[{...reg,id:Date.now()},...prev]);
    if (tarefaContexto) setTarefas(prev=>prev.map(t=>t.id===tarefaContexto.id?{...t,status:"feita"}:t));
    if (reg.proximo_passo&&reg.proximo_prazo) {
      const d=new Date(); d.setDate(d.getDate()+parseInt(reg.proximo_prazo));
      setTarefas(prev=>[{id:Date.now()+1,cliente:reg.cliente,tipo:reg.tipo,prazo:d.toLocaleDateString("pt-BR"),status:"pendente",classificacao:reg.classificacao||"C",obs:reg.proximo_passo},...prev]);
    }
    setTarefaContexto(null); setTela("tarefas");
  }

  function cumprir(tarefa) { setTarefaContexto(tarefa); setTela("chat"); }
  function verCliente(nome) { setTelaAnterior(tela); setClienteDetalhe(nome); setTela("detalhe"); }
  function adicionarCliente(c) { setClientes(prev=>[...prev,c]); }
  function inativarCliente(nome,motivo) { setClientes(prev=>prev.map(c=>c.nome===nome?{...c,status:"inativo",motivo_inativo:motivo||"Inativado pelo vendedor"}:c)); setTarefas(prev=>prev.filter(t=>t.cliente!==nome)); }
  function reativarCliente(nome) { setClientes(prev=>prev.map(c=>c.nome===nome?{...c,status:"ativo",motivo_inativo:""}:c)); }
  function adicionarTarefa(t) { setTarefas(prev=>[t,...prev]); setShowNovaTarefa(false); }

  const navItems = [{id:"tarefas",label:"Tarefas",icon:"☑"},{id:"chat",label:"Registrar",icon:"+"},{id:"clientes",label:"Clientes",icon:"◫"},{id:"gestao",label:"Gestão",icon:"▦"}];
  const titulos = {tarefas:"Minhas tarefas",chat:"Registrar",clientes:"Clientes",gestao:"Painel da gestão"};

  return (
    <div style={{ maxWidth:420, margin:"0 auto", height:"100vh", display:"flex", flexDirection:"column", background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:16, overflow:"hidden", position:"relative" }}>
      {/* Header */}
      <div style={{ padding:"14px 16px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:500 }}>{tela==="detalhe"?clienteDetalhe:titulos[tela]}</div>
          <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginTop:2 }}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {tela==="tarefas" && <button onClick={()=>setShowNovaTarefa(true)} style={{ fontSize:12, padding:"5px 12px", background:"#EEEDFE", color:"#3C3489", border:"0.5px solid #AFA9EC", borderRadius:8, cursor:"pointer", fontWeight:500 }}>+ Tarefa</button>}
          {tela!=="detalhe" && <div style={{ width:32, height:32, borderRadius:"50%", background:"#EEEDFE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:500, color:"#3C3489" }}>S</div>}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex:1, overflow:"hidden" }}>
        {tela==="tarefas" && <PainelTarefas tarefas={tarefas} contatos={contatos} onCumprir={cumprir} onVerCliente={verCliente}/>}
        {tela==="chat" && <TelaChat onSalvar={salvarContato} onNovoCliente={adicionarCliente} onInativarCliente={inativarCliente} clientes={clientes} tarefaContexto={tarefaContexto} onLimparContexto={()=>setTarefaContexto(null)}/>}
        {tela==="clientes" && <TelaClientes clientes={clientes} contatos={contatos} onVerCliente={verCliente}/>}
        {tela==="gestao" && <PainelGestao contatos={contatos} tarefas={tarefas} clientes={clientes}/>}
        {tela==="detalhe" && <DetalheCliente nomeCliente={clienteDetalhe} contatos={contatos} clientes={clientes} onVoltar={()=>setTela(telaAnterior)} onInativar={inativarCliente} onReativar={reativarCliente}/>}
      </div>

      {/* Nav */}
      {tela!=="detalhe" && (
        <div style={{ display:"flex", borderTop:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-primary)", flexShrink:0 }}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>{ setTarefaContexto(null); setTela(n.id); }} style={{ flex:1, padding:"10px 0 12px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, borderTop:tela===n.id?"2px solid #7F77DD":"2px solid transparent", transition:"border-color .2s" }}>
              <span style={{ fontSize:n.id==="chat"?20:16, color:tela===n.id?"#534AB7":"var(--color-text-secondary)" }}>{n.icon}</span>
              <span style={{ fontSize:11, fontWeight:tela===n.id?500:400, color:tela===n.id?"#534AB7":"var(--color-text-secondary)" }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Modal nova tarefa */}
      {showNovaTarefa && <ModalNovaTarefa clientes={clientes} onSalvar={adicionarTarefa} onFechar={()=>setShowNovaTarefa(false)}/>}
    </div>
  );
}
