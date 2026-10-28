import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterStatus, SortOption } from '../types/goal';

interface GoalFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    todos: number;
    nao_iniciado: number;
    em_andamento: number;
    concluido: number;
  };
}

export const GoalFilter: React.FC<GoalFilterProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  currentSort,
  onSortChange,
  counts,
}) => {
  const tabs: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'todos', label: 'Todos', count: counts.todos },
    { id: 'nao_iniciado', label: 'Não iniciados', count: counts.nao_iniciado },
    { id: 'em_andamento', label: 'Em andamento', count: counts.em_andamento },
    { id: 'concluido', label: 'Concluídos', count: counts.concluido },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Barra de Busca e Ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs transition-all"
          />
        </div>

        {/* Dropdown de Ordenação */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="recentes">Mais recentes</option>
            <option value="prazo_crescente">Prazo mais próximo</option>
            <option value="prazo_decrescente">Prazo mais distante</option>
            <option value="alfabetica">Ordem alfabética (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Abas de Filtro por Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
