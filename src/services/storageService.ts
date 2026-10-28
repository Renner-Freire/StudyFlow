import { Goal, GoalFormData } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

/**
 * Exemplos iniciais acolhedores para inspirar o estudante iniciante
 */
export const DEFAULT_INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-demo-1',
    title: 'Compreender variáveis e estruturas de decisão',
    description: 'Estudar os conceitos fundamentais de algoritmos e praticar 5 exercícios práticos de lógica.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-demo-2',
    title: 'Revisar vocabulário básico de inglês para tecnologia',
    description: 'Anotar 20 termos comuns em documentações técnicas e criar cartões de memorização.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-demo-3',
    title: 'Configurar ambiente de estudos e rotina diária',
    description: 'Definir horário fixo de 40 minutos diários sem celular e organizar pasta no computador.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Serviço responsável pelo isolamento e gerenciamento do armazenamento local (localStorage)
 */
export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage
   */
  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com dados de exemplo acolhedores na primeira visita
        this.saveGoals(DEFAULT_INITIAL_GOALS);
        return DEFAULT_INITIAL_GOALS;
      }
      return JSON.parse(data) as Goal[];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage
   */
  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e persiste um novo objetivo de estudo
   */
  createGoal(data: GoalFormData): Goal {
    const goals = this.getGoals();
    const now = new Date().toISOString();
    
    const newGoal: Goal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `goal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Atualiza um objetivo existente por ID
   */
  updateGoal(id: string, data: Partial<GoalFormData>): Goal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const updatedGoal: Goal = {
      ...goals[index],
      ...data,
      title: data.title !== undefined ? data.title.trim() : goals[index].title,
      description: data.description !== undefined ? data.description.trim() : goals[index].description,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  },

  /**
   * Remove um objetivo por ID
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) return false;

    this.saveGoals(filtered);
    return true;
  },

  /**
   * Limpa todos os dados ou redefine para os exemplos iniciais
   */
  resetToDefaults(): Goal[] {
    this.saveGoals(DEFAULT_INITIAL_GOALS);
    return DEFAULT_INITIAL_GOALS;
  },

  /**
   * Esvazia todos os objetivos do storage
   */
  clearAll(): void {
    this.saveGoals([]);
  }
};
