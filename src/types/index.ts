// ============================================================
// TYPES — PSI-Gov Connect
// ============================================================

export type UserRole =
  | 'ADMIN_IPT'
  | 'ADMIN'
  | 'PREFEITO'
  | 'SECRETARIO'
  | 'AUDITOR'
  | 'COORDENADOR'
  | 'GESTOR'
  | 'SERVIDOR_PUBLICO'
  | 'TECNICO'
  | 'TERCEIROS';

export const ROLE_HIERARCHY: Record<string, number> = {
  ADMIN_IPT: 10,
  ADMIN: 9,
  PREFEITO: 8,
  SECRETARIO: 7,
  AUDITOR: 6,
  COORDENADOR: 5,
  GESTOR: 4,
  TECNICO: 3,
  SERVIDOR_PUBLICO: 2,
  TERCEIROS: 1,
};

export function hasMinRole(userRole: UserRole, minRole: UserRole): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  prefectureId: string;
  phone?: string;
  cpf?: string;
  photoURL?: string;
  createdAt?: any;
}

// ============================================================
// DDE
// ============================================================

export type MoodType = 'excellent' | 'good' | 'neutral' | 'tired' | 'bad';

export interface DDEEntry {
  id?: string;
  userId: string;
  prefectureId: string;
  mood: MoodType;
  stressLevel: number; // 1–5
  notes?: string;
  createdAt: any;
}

// ============================================================
// REPORTS
// ============================================================

export type ReportStatus = 'Enviado' | 'Visualizado' | 'Em Análise' | 'Respondido';

export interface Report {
  id?: string;
  userId: string;
  prefectureId: string;
  reportText: string;
  isAnonymous: boolean;
  status: ReportStatus;
  createdAt: any;
  analysis?: {
    category?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    sentiment?: string;
    urgency?: string;
  };
  response?: string;
  respondedAt?: any;
}

// ============================================================
// CHECKLISTS
// ============================================================

export type QuestionType = 'likert' | 'multiple_choice' | 'text' | 'yes_no' | 'checkbox' | 'date';

export interface ChecklistQuestion {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  order: number;
}

export interface Checklist {
  id?: string;
  prefectureId: string;
  title: string;
  description: string;
  isActive: boolean;
  questions: ChecklistQuestion[];
  createdAt?: any;
}

export interface ChecklistAnswer {
  questionId: string;
  answer: string | number | boolean | string[];
}

export interface ChecklistResponse {
  id?: string;
  checklistId: string;
  userId: string;
  prefectureId: string;
  submissionDate: any;
  answers: ChecklistAnswer[];
}

// ============================================================
// ACTION PLANS
// ============================================================

export type ActionPlanStatus = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado';
export type RiskGrade = 'Baixo' | 'Médio' | 'Alto' | 'Crítico';

export interface ActionPlan {
  id?: string;
  prefectureId: string;
  title: string;
  description: string;
  status: ActionPlanStatus;
  riskGrade: RiskGrade;
  deadline: any;
  executorId?: string;
  createdBy: string;
  createdAt?: any;
  evidences?: string[];
}

// ============================================================
// BENEFITS
// ============================================================

export interface Benefit {
  id?: string;
  type: 'coupon' | 'event' | 'reward';
  title: string;
  description: string;
  expiresAt?: any;
  progress?: number; // 0–100
  imageUrl?: string;
}
