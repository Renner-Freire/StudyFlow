import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { GoalStats } from './components/GoalStats';
import { GoalFilter } from './components/GoalFilter';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';
import { storageService } from './services/storageService';
import { Goal, GoalFormData, GoalStatus, FilterStatus, SortOption } from './types/goal';
import { Check, Info, Plus, RotateCcw } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('recentes');

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  // Notificações Toast amigáveis
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Carregar dados salvos no localStorage ao montar o componente
  useEffect(() => {
    const stored = storageService.getGoals();
    setGoals(stored);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Manipulação de Criação & Edição
  const handleOpenCreateModal = () => {
    setGoalToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (goal: Goal) => {
    setGoalToEdit(goal);
    setIsFormModalOpen(true);
  };

  const handleSaveGoal = (formData: GoalFormData) => {
    if (goalToEdit) {
      const updated = storageService.updateGoal(goalToEdit.id, formData);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        showToast('Objetivo atualizado com sucesso!', 'success');
      }
    } else {
      const created = storageService.createGoal(formData);
      setGoals((prev) => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!', 'success');
    }
    setGoalToEdit(null);
  };

  // Manipulação de Mudança Direta de Status
  const handleStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      const statusLabel =
        newStatus === 'concluido'
          ? 'concluído! Parabéns!'
          : newStatus === 'em_andamento'
          ? 'marcado em andamento!'
          : 'marcado como não iniciado.';
      showToast(`Objetivo ${statusLabel}`, 'info');
    }
  };

  // Manipulação de Exclusão com Confirmação
  const handleRequestDelete = (goal: Goal) => {
    setGoalToDelete(goal);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      storageService.deleteGoal(goalToDelete.id);
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
      showToast('Objetivo removido com sucesso.', 'info');
    }
    setIsConfirmModalOpen(false);
    setGoalToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setGoalToDelete(null);
  };

  // Carregar exemplos se tudo for excluído
  const handleRestoreExamples = () => {
    const reset = storageService.resetToDefaults();
    setGoals(reset);
    showToast('Exemplos restaurados no seu StudyFlow!', 'info');
  };

  // Limpar busca e filtros
  const handleClearFilters = () => {
    setFilterStatus('todos');
    setSearchQuery('');
  };

  // Filtragem e ordenação computadas
  const filteredGoals = useMemo(() => {
    let result = [...goals];

    // Filtro por status
    if (filterStatus !== 'todos') {
      result = result.filter((g) => g.status === filterStatus);
    }

    // Busca textual por título ou descrição
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) => g.title.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q))
      );
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortOption === 'recentes') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'alfabetica') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      if (sortOption === 'prazo_crescente') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortOption === 'prazo_decrescente') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return b.deadline.localeCompare(a.deadline);
      }
      return 0;
    });

    return result;
  }, [goals, filterStatus, searchQuery, sortOption]);

  const counts = useMemo(
    () => ({
      todos: goals.length,
      nao_iniciado: goals.filter((g) => g.status === 'nao_iniciado').length,
      em_andamento: goals.filter((g) => g.status === 'em_andamento').length,
      concluido: goals.filter((g) => g.status === 'concluido').length,
    }),
    [goals]
  );

  const isFiltered = filterStatus !== 'todos' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast de Notificação */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-3 text-sm">
            {toast.type === 'success' ? (
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            ) : (
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Info className="w-3.5 h-3.5" />
              </span>
            )}
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <Header onOpenNewGoalModal={handleOpenCreateModal} totalGoals={goals.length} />

      {/* Conteúdo Principal */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Banner de Boas-vindas para Estudantes Iniciantes */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Meus Objetivos de Estudo
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Organize seus passos de aprendizado e acompanhe sua evolução de forma leve e clara.
            </p>
          </div>

          {goals.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar Objetivo
              </button>
            </div>
          )}
        </div>

        {/* Resumo de Estatísticas e Progresso */}
        <GoalStats goals={goals} />

        {/* Barra de Filtros, Busca e Ordenação */}
        {goals.length > 0 && (
          <GoalFilter
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentSort={sortOption}
            onSortChange={setSortOption}
            counts={counts}
          />
        )}

        {/* Lista de Cards de Objetivos ou Estados Vazios */}
        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleOpenEditModal}
                onRequestDelete={handleRequestDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            isFiltered={isFiltered}
            onOpenNewGoalModal={handleOpenCreateModal}
            onClearFilters={isFiltered ? handleClearFilters : undefined}
            onRestoreExamples={goals.length === 0 ? handleRestoreExamples : undefined}
          />
        )}

        {/* Botão sutil para restaurar exemplos se todos forem apagados */}
        {goals.length === 0 && !isFiltered && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={handleRestoreExamples}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar objetivos de exemplo
            </button>
          </div>
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong className="text-indigo-600 font-semibold">StudyFlow</strong> — Feito para estudantes que dão um passo a cada dia.
          </p>
          <p className="text-slate-400">
            Seus dados são salvos localmente no seu navegador ({goals.length} objetivo{goals.length !== 1 ? 's' : ''} registrado{goals.length !== 1 ? 's' : ''}).
          </p>
        </div>
      </footer>

      {/* Modal de Formulário (Criar / Editar) */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveGoal}
        goalToEdit={goalToEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        goal={goalToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
