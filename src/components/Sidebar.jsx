import React from 'react';
import { LayoutDashboard, Users, GitBranch, Filter, Award, Trophy, DollarSign } from 'lucide-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// ALTERADO: O componente NavItem agora também recebe 'isOpen' para saber se mostra o texto.
const NavItem = ({ page, activePage, setActivePage, icon, children, isOpen }) => (
  <button 
    onClick={() => setActivePage(page)} 
    // ALTERADO: Centraliza o ícone quando a sidebar está fechada (isOpen é false)
    className={`flex items-center p-3 rounded-lg w-full text-left transition-colors ${activePage === page ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} ${isOpen ? 'space-x-3' : 'justify-center'}`}
  >
    {icon}
    {/* ALTERADO: O texto (children) só é renderizado se a sidebar estiver aberta */}
    {isOpen && <span>{children}</span>}
  </button>
);

// ALTERADO: O componente Sidebar agora recebe a prop 'isOpen'
const Sidebar = ({ activePage, setActivePage, isOpen }) => {
  return (
    // ALTERADO: A largura agora é dinâmica e uma transição foi adicionada para suavizar a animação
    <aside className={`flex-shrink-0 bg-gray-800 p-4 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
      
      {/* ALTERADO: Centralizamos o contêiner do logo */}
      <div className={`flex items-center mb-10 ${isOpen ? 'space-x-2' : 'justify-center'}`}>
        <GitBranch className="text-orange-500 flex-shrink-0" />
        {/* ALTERADO: O título some suavemente quando a sidebar fecha */}
        <h1 className={`text-xl font-bold text-white whitespace-nowrap transition-opacity duration-200 ${!isOpen && 'opacity-0 hidden'}`}>
          Análise Fancore
        </h1>
      </div>

      <nav className="space-y-2">
        {/* ALTERADO: Passamos a prop 'isOpen' para cada NavItem */}
        <NavItem page="automation" activePage={activePage} setActivePage={setActivePage} icon={<LayoutDashboard size={20} />} isOpen={isOpen}>Automação</NavItem>
        <NavItem page="funil" activePage={activePage} setActivePage={setActivePage} icon={<Filter size={20} />} isOpen={isOpen}>Funil de Vendas</NavItem>
        <NavItem page="sdr" activePage={activePage} setActivePage={setActivePage} icon={<Users size={20} />} isOpen={isOpen}>Performance SDR</NavItem>
        <NavItem page="closer" activePage={activePage} setActivePage={setActivePage} icon={<Award size={20} />} isOpen={isOpen}>Performance Closer</NavItem>
        <NavItem page="ranking" activePage={activePage} setActivePage={setActivePage} icon={<Trophy size={20} />} isOpen={isOpen}>Ranking SDR</NavItem>
        <NavItem page="cac" activePage={activePage} setActivePage={setActivePage} icon={<DollarSign size={20} />} isOpen={isOpen}>Análise CAC</NavItem>
      </nav>
              {/* NOVO: Botão para alternar a sidebar, posicionado no final */}
        <div className={`mt-auto pt-4 border-t border-gray-700 ${isOpen ? 'flex justify-end' : 'flex justify-center'}`}>
            <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Toggle sidebar"
            >
                {/* Muda o ícone dependendo do estado da sidebar */}
                {isOpen ? (
                    <ChevronLeftIcon className="h-6 w-6" />
                ) : (
                    <ChevronRightIcon className="h-6 w-6" />
                )}
            </button>
        </div>
    </aside>
  );
};

export default Sidebar;