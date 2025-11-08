export interface WebService {
  id: string;
  name: string;
  url: string;
  description: string;
}

export interface ApiAnalysisResult {
  serviceName: string;
  serviceUrl: string;
  analyzedAt: Date;
  overallScore: number;
  violations: Violation[];
  recommendations: Recommendation[];
  summary: {
    totalRules: number;
    passedRules: number;
    failedRules: number;
    warningRules: number;
  };
}

export interface Violation {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  description: string;
  endpoint?: string;
  method?: string;
  details: string;
  recommendation: string;
  impact: string;
  examples?: string[];
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionItems: string[];
}

export interface DesignRule {
  id: string;
  name: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  rationale: string;
  checkFunction: string;
  examples: {
    good: string[];
    bad: string[];
  };
}

