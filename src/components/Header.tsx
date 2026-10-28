import React from 'react';
import { BookOpen, Plus, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenNewGoalModal: () => void;
  totalGoals: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewGoalModal, totalGoals }) => {
  return (
    <header className="border-b border-indigo-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Marca & Identidade */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-50">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Study<span className="text-indigo-600">Flow</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                <Compass className="w-3 h-3" />
                Guia do Iniciante
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Transforme o que você quer aprender em passos reais
            </p>
          </div>
        </div>

        {/* Botão de Ação Principal */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenNewGoalModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Novo Objetivo</span>
            <span className="xs:hidden">Criar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
