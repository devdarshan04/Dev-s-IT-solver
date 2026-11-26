export type UserRole = 'user' | 'admin' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  resolvedIssuesCount: number;
}

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'resolved' | 'in_progress' | 'unresolved';
export type IssueCategory = 
  | 'DevOps & Containers' 
  | 'Frontend & Web' 
  | 'Backend & APIs' 
  | 'Operating Systems' 
  | 'Databases' 
  | 'Cloud Infrastructure' 
  | 'Networking & DNS' 
  | 'Security & Auth';

export interface TroubleshootingStep {
  id: string;
  order: number;
  title: string;
  instruction: string;
  command?: string;
  codeSnippet?: string;
  completed: boolean;
  caution?: string;
}

export interface DiagnosticResultData {
  id: string;
  title: string;
  errorCode: string;
  category: IssueCategory;
  severity: IssueSeverity;
  confidence: number; // 0 - 100
  detectedEnvironment: string;
  summary: string;
  quickFix: string;
  rootCause: string;
  steps: TroubleshootingStep[];
  preventionTips: string[];
  alternativeWorkaround?: string;
  timestamp: string;
}

export interface SimilarIssue {
  id: string;
  title: string;
  errorCode: string;
  category: IssueCategory;
  similarityScore: number; // 0 - 100
  solutionSummary: string;
  verified: boolean;
  os: string;
  upvotes: number;
}

export interface ProblemRecord {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  imageUrl?: string;
  extractedText?: string;
  diagnosticResult: DiagnosticResultData;
  status: IssueStatus;
  createdAt: string;
  resolvedAt?: string;
  userNotes?: string;
  timeSpentMinutes?: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  errorCode: string;
  category: IssueCategory;
  os: 'Windows' | 'Linux' | 'macOS' | 'Cross-Platform';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  views: number;
  upvotes: number;
  author: string;
  verified: boolean;
  summary: string;
  rootCause: string;
  steps: { stepNumber: number; title: string; detail: string; command?: string }[];
  tags: string[];
  lastUpdated: string;
}

export interface AnalyticsMetrics {
  totalIssuesDiagnosed: number;
  resolvedCount: number;
  inProgressCount: number;
  unresolvedCount: number;
  resolutionRate: number;
  avgResolutionTimeMinutes: number;
  activeUsersCount: number;
  categoryDistribution: { category: string; count: number; percentage: number; color: string }[];
  severityDistribution: { severity: IssueSeverity; count: number; color: string }[];
  weeklyTrends: { day: string; reported: number; resolved: number }[];
  topErrorCodes: { code: string; count: number; category: string; avgTime: string; severity: IssueSeverity }[];
  recentIncidents: ProblemRecord[];
}
