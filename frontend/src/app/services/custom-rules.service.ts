import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { CustomRule, RuleSet } from '../models/custom-rule.model';

@Injectable({
  providedIn: 'root'
})
export class CustomRulesService {
  private readonly STORAGE_KEY = 'api-inspector-custom-rules';
  private readonly RULESETS_KEY = 'api-inspector-rule-sets';
  
  private customRules$ = new BehaviorSubject<CustomRule[]>([]);
  private ruleSets$ = new BehaviorSubject<RuleSet[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  getCustomRules(): Observable<CustomRule[]> {
    return this.customRules$.asObservable();
  }

  getRuleSets(): Observable<RuleSet[]> {
    return this.ruleSets$.asObservable();
  }

  addCustomRule(rule: Omit<CustomRule, 'id' | 'createdAt' | 'updatedAt'>): CustomRule {
    const newRule: CustomRule = {
      ...rule,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const rules = this.customRules$.value;
    rules.push(newRule);
    this.customRules$.next(rules);
    this.saveToStorage();
    
    return newRule;
  }

  updateCustomRule(id: string, updates: Partial<CustomRule>): boolean {
    const rules = this.customRules$.value;
    const index = rules.findIndex(r => r.id === id);
    
    if (index !== -1) {
      rules[index] = {
        ...rules[index],
        ...updates,
        updatedAt: new Date()
      };
      this.customRules$.next(rules);
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  deleteCustomRule(id: string): boolean {
    const rules = this.customRules$.value;
    const filtered = rules.filter(r => r.id !== id);
    
    if (filtered.length !== rules.length) {
      this.customRules$.next(filtered);
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  toggleRuleEnabled(id: string): boolean {
    const rules = this.customRules$.value;
    const rule = rules.find(r => r.id === id);
    
    if (rule) {
      rule.enabled = !rule.enabled;
      rule.updatedAt = new Date();
      this.customRules$.next(rules);
      this.saveToStorage();
      return rule.enabled;
    }
    
    return false;
  }

  createRuleSet(name: string, description: string, ruleIds: string[]): RuleSet {
    const rules = this.customRules$.value.filter(r => ruleIds.includes(r.id));
    
    const ruleSet: RuleSet = {
      id: this.generateId(),
      name,
      description,
      rules,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const ruleSets = this.ruleSets$.value;
    ruleSets.push(ruleSet);
    this.ruleSets$.next(ruleSets);
    this.saveRuleSetsToStorage();
    
    return ruleSet;
  }

  exportRules(rules: CustomRule[]): string {
    return JSON.stringify(rules, null, 2);
  }

  importRules(jsonString: string): number {
    try {
      const imported = JSON.parse(jsonString) as CustomRule[];
      const rules = this.customRules$.value;
      
      imported.forEach(rule => {
        // Add with new ID to avoid conflicts
        rules.push({
          ...rule,
          id: this.generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      
      this.customRules$.next(rules);
      this.saveToStorage();
      
      return imported.length;
    } catch (err) {
      console.error('Import error:', err);
      return 0;
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const rules = JSON.parse(stored);
        this.customRules$.next(rules);
      }

      const storedSets = localStorage.getItem(this.RULESETS_KEY);
      if (storedSets) {
        const ruleSets = JSON.parse(storedSets);
        this.ruleSets$.next(ruleSets);
      }
    } catch (err) {
      console.error('Error loading from storage:', err);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.customRules$.value));
    } catch (err) {
      console.error('Error saving to storage:', err);
    }
  }

  private saveRuleSetsToStorage(): void {
    try {
      localStorage.setItem(this.RULESETS_KEY, JSON.stringify(this.ruleSets$.value));
    } catch (err) {
      console.error('Error saving rule sets:', err);
    }
  }

  private generateId(): string {
    return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

