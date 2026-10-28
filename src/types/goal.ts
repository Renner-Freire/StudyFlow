export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type GoalFormData = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;

export type FilterStatus = 'todos' | GoalStatus;
export type SortOption = 'prazo_crescente' | 'prazo_decrescente' | 'recentes' | 'alfabetica';
