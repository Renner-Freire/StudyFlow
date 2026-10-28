import React from 'react';
import { Target, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { Goal } from '../types/goal';

interface GoalStatsProps {
  goals: Goal[];
}

export const GoalStats: React.FC<GoalStatsProps> = ({ goals }) => {
  const total = goals.length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;

  const percentualConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-8">
      {/* Cabeçalho de Progresso Geral */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <h2 className="text-base font-semibold text-slate-800">
              Resumo do seu ritmo de aprendizado
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {total === 0 
              ? 'Nenhum objetivo registrado ainda. Que tal dar o primeiro passo?' 
              : concluidos === total 
                ? 'Incrível! Todos os objetivos cadastrados foram concluídos!' 
                : `${concluidos} de ${total} objetivos concluídos até o momento.`}
          </p>
        </div>

        {total > 0 && (
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500 block">Progresso</span>
              <span className="text-lg font-bold text-indigo-700 leading-none">{percentualConcluido}%</span>
            </div>
            <div className="w-16 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentualConcluido}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cartões com Contagens Detalhadas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {/* Total Geral */}
        <div className="bg-indigo-50/60 border border-indigo-100/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-indigo-900/70 block">Total de Objetivos</span>
            <span className="text-xl font-bold text-indigo-950">{total}</span>
          </div>
        </div>

        {/* Em Andamento */}
        <div className="bg-amber-50/60 border border-amber-100/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600/10 text-amber-600 flex items-center justify-center shrink-0">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-900/70 block">Em Andamento</span>
            <span className="text-xl font-bold text-amber-950">{emAndamento}</span>
          </div>
        </div>

        {/* Não Iniciados */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-600 block">Não Iniciados</span>
            <span className="text-xl font-bold text-slate-800">{naoIniciados}</span>
          </div>
        </div>

        {/* Concluídos */}
        <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-900/70 block">Concluídos</span>
            <span className="text-xl font-bold text-emerald-950">{concluidos}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
