import React from 'react';
import { LayoutDashboard, Users, GitBranch, Filter, Award, Trophy, DollarSign, Map } from 'lucide-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const NavItem = ({ page, activePage, setActivePage, icon, children, isOpen }) => (
  <button 
    onClick={() => setActivePage(page)} 
    className={`flex items-center p-3 rounded-lg w-full text-left transition-colors ${activePage === page ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} ${isOpen ? 'space-x-3' : 'justify-center'}`}
  >
    {icon}
    {/* No mobile, a sidebar estará sempre "aberta" em sua largura total (w-64), então o texto sempre aparece. No desktop, ele some quando está recolhida. */}
    <span className={`${!isOpen && 'lg:hidden'}`}>{children}</span>
  </button>
);

const Sidebar = ({ activePage, setActivePage, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Backdrop para fechar o menu no mobile ao clicar fora da sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      {/* Container da Sidebar com classes para mobile e desktop */}
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
                  {/* O texto do logo some no desktop quando a sidebar está recolhida */}
                  <h1 className={`text-xl font-bold text-white whitespace-nowrap transition-opacity duration-200 ${!isOpen && 'lg:opacity-0 lg:hidden'}`}>
                      Análise Fancore
                  </h1>
              </div>
              <nav className="space-y-2">
                  <NavItem page="automation" activePage={activePage} setActivePage={setActivePage} icon={<LayoutDashboard size={20} />} isOpen={isOpen}>Automação</NavItem>
                  <NavItem page="funil" activePage={activePage} setActivePage={setActivePage} icon={<Filter size={20} />} isOpen={isOpen}>Funil de Vendas</NavItem>
                  <NavItem page="sdr" activePage={activePage} setActivePage={setActivePage} icon={<Users size={20} />} isOpen={isOpen}>Performance SDR</NavItem>
                  <NavItem page="closer" activePage={activePage} setActivePage={setActivePage} icon={<Award size={20} />} isOpen={isOpen}>Performance Closer</NavItem>
                  <NavItem page="ranking" activePage={activePage} setActivePage={setActivePage} icon={<Trophy size={20} />} isOpen={isOpen}>Ranking SDR</NavItem>
                  <NavItem page="cac" activePage={activePage} setActivePage={setActivePage} icon={<DollarSign size={20} />} isOpen={isOpen}>Análise CAC</NavItem>
                  <NavItem page="map" activePage={activePage} setActivePage={setActivePage} icon={<Map size={20} />} isOpen={isOpen}>Mapa de Vendas</NavItem>
              </nav>
          </div>

          {/* Botão de expandir/recolher visível apenas no Desktop */}
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

