import React from 'react';
import { LayoutDashboard, Users, GitBranch, Filter, Award, Trophy, DollarSign } from 'lucide-react';

const NavItem = ({ page, activePage, setActivePage, icon, children }) => (
  <button onClick={() => setActivePage(page)} className={`flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-colors ${activePage === page ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
    {icon}
    <span>{children}</span>
  </button>
);

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    // --- CORES ATUALIZADAS ---
    <aside className="w-64 bg-gray-800 p-4 flex-shrink-0">
      <div className="flex items-center space-x-2 mb-10">
        <GitBranch className="text-orange-500" />
        <h1 className="text-xl font-bold text-white">Análise Fancore</h1>
      </div>
      <nav className="space-y-2">
        <NavItem page="automation" activePage={activePage} setActivePage={setActivePage} icon={<LayoutDashboard size={20} />}>Automação</NavItem>
        <NavItem page="funil" activePage={activePage} setActivePage={setActivePage} icon={<Filter size={20} />}>Funil de Vendas</NavItem>
        <NavItem page="sdr" activePage={activePage} setActivePage={setActivePage} icon={<Users size={20} />}>Performance SDR</NavItem>
        <NavItem page="closer" activePage={activePage} setActivePage={setActivePage} icon={<Award size={20} />}>Performance Closer</NavItem>
        <NavItem page="ranking" activePage={activePage} setActivePage={setActivePage} icon={<Trophy size={20} />}>Ranking SDR</NavItem>
        <NavItem page="cac" activePage={activePage} setActivePage={setActivePage} icon={<DollarSign size={20} />}>Análise CAC</NavItem>
      </nav>
    </aside>
  );
};

export default Sidebar;
