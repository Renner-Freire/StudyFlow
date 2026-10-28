import React from 'react';
import { Calendar, Trash2, Edit3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Goal, GoalStatus } from '../types/goal';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onRequestDelete: (goal: Goal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onRequestDelete,
  onStatusChange,
}) => {
  // Configuração visual por status
  const statusConfig: Record<
    GoalStatus,
    { label: string; badgeClass: string; icon: React.ReactNode; borderHover: string }
  > = {
    nao_iniciado: {
      label: 'Não iniciado',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
      borderHover: 'hover:border-slate-300',
    },
    em_andamento: {
      label: 'Em andamento',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />,
      borderHover: 'hover:border-amber-300',
    },
    concluido: {
      label: 'Concluído',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      borderHover: 'hover:border-emerald-300',
    },
  };

  const currentStatus = statusConfig[goal.status];

  // Cálculo amigável do prazo
  const getDeadlineInfo = (deadlineStr: string, isCompleted: boolean) => {
    if (!deadlineStr) return { text: 'Sem data definida', color: 'text-slate-400', isOverdue: false };

    // Comparar apenas as datas (ano, mês, dia)
    const [year, month, day] = deadlineStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

    if (isCompleted) {
      return {
        text: `Prazo era ${formattedDate}`,
        badge: 'Concluído',
        color: 'text-slate-500',
        isOverdue: false,
      };
    }

    if (diffDays < 0) {
      const daysOverdue = Math.abs(diffDays);
      return {
        text: `${formattedDate} (${daysOverdue} dia${daysOverdue > 1 ? 's' : ''} em atraso)`,
        badge: 'Atrasado',
        color: 'text-rose-600 font-semibold',
        isOverdue: true,
      };
    }

    if (diffDays === 0) {
      return {
        text: `${formattedDate} (Vence hoje!)`,
        badge: 'Hoje',
        color: 'text-amber-600 font-semibold',
        isOverdue: false,
      };
    }

    if (diffDays === 1) {
      return {
        text: `${formattedDate} (Vence amanhã)`,
        badge: 'Amanhã',
        color: 'text-amber-700',
        isOverdue: false,
      };
    }

    return {
      text: `${formattedDate} (em ${diffDays} dias)`,
      badge: `${diffDays} dias`,
      color: 'text-slate-600',
      isOverdue: false,
    };
  };

  const deadlineInfo = getDeadlineInfo(goal.deadline, goal.status === 'concluido');

  return (
    <article
      className={`group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative ${currentStatus.borderHover} ${
        goal.status === 'concluido' ? 'bg-slate-50/40' : ''
      }`}
    >
      <div>
        {/* Cabeçalho do Card: Status e Ações */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Seletor rápido de Status */}
          <div className="relative inline-block">
            <select
              value={goal.status}
              onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
              className={`appearance-none cursor-pointer text-xs font-semibold px-2.5 py-1 pr-6 rounded-full border inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors ${currentStatus.badgeClass}`}
              title="Clique para alterar o status"
            >
              <option value="nao_iniciado">⚪ Não iniciado</option>
              <option value="em_andamento">🟡 Em andamento</option>
              <option value="concluido">🟢 Concluído</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-current opacity-70">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar objetivo ${goal.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onRequestDelete(goal)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir objetivo ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold text-slate-900 leading-snug mb-2 ${
            goal.status === 'concluido' ? 'line-through text-slate-500' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do Objetivo */}
        {goal.description ? (
          <p
            className={`text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4 ${
              goal.status === 'concluido' ? 'text-slate-400' : ''
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mb-4">Sem descrição detalhada.</p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e indicador visual */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className={deadlineInfo.color}>{deadlineInfo.text}</span>
        </div>

        {deadlineInfo.isOverdue && goal.status !== 'concluido' && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            Atenção
          </span>
        )}
      </div>
    </article>
  );
};
