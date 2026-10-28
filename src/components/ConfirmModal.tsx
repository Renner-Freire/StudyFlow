import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Goal } from '../types/goal';

interface ConfirmModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  goal,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !goal) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 id="confirm-dialog-title" className="text-base font-bold text-slate-900">
                Excluir objetivo de estudo?
              </h3>
              <button
                type="button"
                onClick={onCancel}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                aria-label="Cancelar e fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p id="confirm-dialog-desc" className="text-xs text-slate-500 mt-1">
              Esta ação removerá este objetivo da sua lista. Os dados não poderão ser recuperados após a exclusão.
            </p>

            {/* Destaque do item a ser excluído */}
            <div className="mt-3.5 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">
                Objetivo selecionado:
              </span>
              <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                "{goal.title}"
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Manter objetivo
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            <Trash2 className="w-4 h-4" />
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
};
