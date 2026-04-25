import React, { useState } from 'react';
import { MessageSquare, ClipboardList, BarChart3, Plus } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('tarefas');

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">CRM Follow-up AI</h1>
      </header>

      <main className="p-4">
        {activeTab === 'tarefas' && <div className="p-10 text-center">📋 Lista de Tarefas (Carregando...)</div>}
        {activeTab === 'chat' && <div className="p-10 text-center">💬 Chat IA (Pronto para ouvir)</div>}
        {activeTab === 'gestao' && <div className="p-10 text-center">📊 Painel de Gestão</div>}
      </main>

      {/* Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3">
        <button onClick={() => setActiveTab('tarefas')} className="flex flex-col items-center text-gray-600"><ClipboardList /><span>Tarefas</span></button>
        <button onClick={() => setActiveTab('chat')} className="flex flex-col items-center text-blue-600"><Plus className="bg-blue-100 rounded-full p-1" /><span>Registrar</span></button>
        <button onClick={() => setActiveTab('gestao')} className="flex flex-col items-center text-gray-600"><BarChart3 /><span>Gestão</span></button>
      </nav>
    </div>
  );
}

export default App;
