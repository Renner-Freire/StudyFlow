import React from 'react';
import { Sparkles, Plus, Compass, BookOpenCheck } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewGoalModal: () => void;
  onClearFilters?: () => void;
  onRestoreExamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewGoalModal,
  onClearFilters,
  onRestoreExamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Compass className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Nenhum objetivo encontrado com esses filtros
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Tente alterar o termo de busca ou selecionar outra aba de status para ver seus objetivos cadastrados.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Limpar filtros e busca
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 sm:p-14 text-center max-w-xl mx-auto my-6">
      {/* Ilustração / Ícone acolhedor */}
      <div className="relative inline-block mb-5">
        <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-indigo-100 via-violet-100 to-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner mx-auto">
          <BookOpenCheck className="w-10 h-10" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
        Sua jornada de aprendizado começa aqui!
      </h3>
      <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
        Não importa se o seu objetivo é grande ou pequeno: o segredo de quem aprende de verdade é dividir o conteúdo em etapas claras.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenNewGoalModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Cadastrar meu primeiro objetivo
        </button>

        {onRestoreExamples && (
          <button
            type="button"
            onClick={onRestoreExamples}
            className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Carregar exemplos para inspirar
          </button>
        )}
      </div>

      {/* Dica para iniciantes */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-left bg-indigo-50/40 rounded-xl p-4">
        <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">
          💡 Dica StudyFlow:
        </span>
        <p className="text-xs text-indigo-800/80 leading-relaxed">
          Evite títulos vagos como "Aprender Matemática". Prefira algo específico e mensurável, como "Assistir aula de Trigonometria e fazer 5 exercícios".
        </p>
      </div>
    </div>
  );
};
