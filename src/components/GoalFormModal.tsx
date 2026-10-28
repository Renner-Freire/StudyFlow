import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Goal, GoalFormData, GoalStatus } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  goalToEdit?: Goal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  // Obter data padrão de amanhã no formato YYYY-MM-DD
  const getDefaultDeadline = () => {
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description || '');
      setDeadline(goalToEdit.deadline || getDefaultDeadline());
      setStatus(goalToEdit.status);
    } else {
      setTitle('');
      setDescription('');
      setDeadline(getDefaultDeadline());
      setStatus('nao_iniciado');
    }
    setErrors({});
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, insira o título do que você quer aprender.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Defina uma data limite para se orientar no tempo.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  const handleQuickSuggestion = (suggestedTitle: string) => {
    setTitle(suggestedTitle);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-100 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">
              {goalToEdit ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {goalToEdit
                ? 'Atualize os detalhes do seu objetivo para manter seu ritmo em dia.'
                : 'Defina uma meta clara para focar sua energia no aprendizado.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-sm font-semibold text-slate-700 mb-1.5">
              O que você quer aprender ou praticar? <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              placeholder="Ex.: Aprender funções em Python, Ler capítulo 3 de História..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.title ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-300'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.title}
              </p>
            )}

            {/* Sugestões rápidas para estudantes iniciantes (apenas na criação) */}
            {!goalToEdit && !title && (
              <div className="mt-2.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Exemplos para se inspirar:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Dominar estruturas de repetição (for/while)',
                    'Revisar 15 flashcards de vocabulário',
                    'Resolver 10 exercícios de frações',
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleQuickSuggestion(sug)}
                      className="text-xs bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100/80 transition-colors text-left cursor-pointer"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Descrição ou anotações adicionais <span className="text-xs font-normal text-slate-400">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              placeholder="Adicione detalhes, links de aulas, tópicos a cobrir ou o que te motiva neste estudo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Grid com Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo: Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Data limite (Prazo) <span className="text-rose-500">*</span>
              </label>
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.deadline ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.deadline && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.deadline}</p>
              )}
            </div>

            {/* Campo: Status */}
            <div>
              <label htmlFor="goal-status" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-slate-400" />
                Status do objetivo
              </label>
              <select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="nao_iniciado">⚪ Não iniciado</option>
                <option value="em_andamento">🟡 Em andamento</option>
                <option value="concluido">🟢 Concluído</option>
              </select>
            </div>
          </div>

          {/* Rodapé com botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {goalToEdit ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
