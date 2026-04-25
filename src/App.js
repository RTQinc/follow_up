import React, { useState } from "react";
import { MessageSquare, ClipboardList, BarChart3, Plus } from 'lucide-react';

export default function App() {
  const [tela, setTela] = useState("tarefas");

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <header style={{ padding: 20, background: "#7F77DD", color: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>CRM Follow-up</h1>
      </header>
      
      <main style={{ flex: 1, padding: 20, textAlign: "center" }}>
        {tela === "tarefas" ? (
          <div>
            <h3>📋 Suas Tarefas</h3>
            <p>O ambiente está pronto! Se você está vendo isso, o deploy funcionou.</p>
          </div>
        ) : (
          <div>
            <h3>💬 Chat IA</h3>
            <p>Em breve: integração com a planilha.</p>
          </div>
        )}
      </main>

      <nav style={{ display: "flex", borderTop: "1px solid #eee", padding: 10 }}>
        <button onClick={() => setTela("tarefas")} style={{ flex: 1, padding: 10 }}>Tarefas</button>
        <button onClick={() => setTela("chat")} style={{ flex: 1, padding: 10 }}>Chat</button>
      </nav>
    </div>
  );
}  
