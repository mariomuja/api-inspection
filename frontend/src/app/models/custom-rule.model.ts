export interface CustomRule {
  id: string;
  name: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  rationale: string;
  impact: string;
  checkPattern: string; // Regex or description of what to check
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RuleSet {
  id: string;
  name: string;
  description: string;
  rules: CustomRule[];
  createdAt: Date;
  updatedAt: Date;
}

