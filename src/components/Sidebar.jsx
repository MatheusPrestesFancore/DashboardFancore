import React from 'react';
// NOVO: Importe o ícone LayoutGrid
import { LayoutDashboard, Users, GitBranch, Filter, Award, Trophy, DollarSign, Map, LayoutGrid } from 'lucide-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const NavItem = ({ page, activePage, setActivePage, icon, children, isOpen }) => (
  <button 
    onClick={() => setActivePage(page)} 
    className={`flex items-center p-3 rounded-lg w-full text-left transition-colors ${activePage === page ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} ${isOpen ? 'space-x-3' : 'justify-center'}`}
  >
    {icon}
    <span className={`${!isOpen && 'lg:hidden'}`}>{children}</span>
  </button>
);

const Sidebar = ({ activePage, setActivePage, isOpen, toggleSidebar }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      <aside 
        className={`fixed inset-y-0 left-0 bg-gray-800 p-4 flex flex-col z-30
                    w-64 transition-transform duration-300 ease-in-out
                    lg:relative lg:w-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                    ${isOpen ? 'lg:w-64' : 'lg:w-20'}`}
      >
          <div className="flex-grow"> 
              <div className={`flex items-center mb-10 ${isOpen ? 'space-x-2' : 'justify-center'}`}>
                  <GitBranch className="text-orange-500 flex-shrink-0" />
                  <h1 className={`text-xl font-bold text-white whitespace-nowrap transition-opacity duration-200 ${!isOpen && 'lg:opacity-0 lg:hidden'}`}>
                      Análise Fancore
                  </h1>
              </div>
              <nav className="space-y-2">
                  {/* NOVO: Link para a Visão Geral no topo do menu */}
                  <NavItem page="overview" activePage={activePage} setActivePage={setActivePage} icon={<LayoutGrid size={20} />} isOpen={isOpen}>Visão Geral</NavItem>
                  <NavItem page="automation" activePage={activePage} setActivePage={setActivePage} icon={<LayoutDashboard size={20} />} isOpen={isOpen}>Automação</NavItem>
                  <NavItem page="funil" activePage={activePage} setActivePage={setActivePage} icon={<Filter size={20} />} isOpen={isOpen}>Funil de Vendas</NavItem>
                  <NavItem page="sdr" activePage={activePage} setActivePage={setActivePage} icon={<Users size={20} />} isOpen={isOpen}>Performance SDR</NavItem>
                  <NavItem page="closer" activePage={activePage} setActivePage={setActivePage} icon={<Award size={20} />} isOpen={isOpen}>Performance Closer</NavItem>
                  <NavItem page="ranking" activePage={activePage} setActivePage={setActivePage} icon={<Trophy size={20} />} isOpen={isOpen}>Ranking SDR</NavItem>
                  <NavItem page="cac" activePage={activePage} setActivePage={setActivePage} icon={<DollarSign size={20} />} isOpen={isOpen}>Análise CAC</NavItem>
                  <NavItem page="map" activePage={activePage} setActivePage={setActivePage} icon={<Map size={20} />} isOpen={isOpen}>Mapa de Vendas</NavItem>
              </nav>
          </div>

          <div className={`mt-auto pt-4 border-t border-gray-700 ${isOpen ? 'flex justify-end' : 'flex justify-center'}`}>
              <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white hidden lg:block"
                  aria-label="Toggle sidebar"
              >
                  {isOpen ? (
                      <ChevronLeftIcon className="h-6 w-6" />
                  ) : (
                      <ChevronRightIcon className="h-6 w-6" />
                  )}
              </button>
          </div>
      </aside>
    </>
  );
};

export default Sidebar;

