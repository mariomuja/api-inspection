import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CustomRulesService } from '../services/custom-rules.service';
import { CustomRule } from '../models/custom-rule.model';

@Component({
  selector: 'app-custom-rules-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatListModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>rule_settings</mat-icon>
      Custom Rules Manager
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content>
      <mat-tab-group>
        <mat-tab label="My Rules">
          <div class="tab-content">
            <div class="rules-list">
              <div *ngIf="customRules().length === 0" class="empty-state">
                <mat-icon>inbox</mat-icon>
                <p>No custom rules yet. Create your first rule!</p>
              </div>

              <mat-list *ngIf="customRules().length > 0">
                <mat-list-item *ngFor="let rule of customRules()">
                  <div class="rule-item">
                    <div class="rule-header">
                      <h3>{{ rule.name }}</h3>
                      <div class="rule-actions">
                        <mat-slide-toggle 
                          [checked]="rule.enabled"
                          (change)="toggleRule(rule.id)"
                          matTooltip="Enable/Disable rule">
                        </mat-slide-toggle>
                        <button mat-icon-button (click)="editRule(rule)" matTooltip="Edit">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteRule(rule.id)" matTooltip="Delete">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </div>
                    <div class="rule-meta">
                      <span class="severity-badge severity-{{ rule.severity }}">{{ rule.severity }}</span>
                      <span class="category-badge">{{ rule.category }}</span>
                    </div>
                    <p class="rule-description">{{ rule.description }}</p>
                  </div>
                </mat-list-item>
              </mat-list>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Create Rule">
          <div class="tab-content">
            <form [formGroup]="ruleForm" (ngSubmit)="saveRule()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Rule Name</mat-label>
                <input matInput formControlName="name" placeholder="e.g., Use camelCase for field names">
                <mat-icon matPrefix>title</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category">
                  <mat-option value="Custom Rules">Custom Rules</mat-option>
                  <mat-option value="Company Standards">Company Standards</mat-option>
                  <mat-option value="REST Principles">REST Principles</mat-option>
                  <mat-option value="Security">Security</mat-option>
                  <mat-option value="Performance">Performance</mat-option>
                  <mat-option value="Data Types">Data Types</mat-option>
                  <mat-option value="Documentation">Documentation</mat-option>
                </mat-select>
                <mat-icon matPrefix>category</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Severity</mat-label>
                <mat-select formControlName="severity">
                  <mat-option value="error">Error</mat-option>
                  <mat-option value="warning">Warning</mat-option>
                  <mat-option value="info">Info</mat-option>
                </mat-select>
                <mat-icon matPrefix>priority_high</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3" 
                  placeholder="Describe what this rule checks for"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Rationale (Why this matters)</mat-label>
                <textarea matInput formControlName="rationale" rows="2"
                  placeholder="Explain why this rule is important"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Impact (What happens if not followed)</mat-label>
                <textarea matInput formControlName="impact" rows="2"
                  placeholder="Describe the impact of not following this rule"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Check Pattern (Regex or description)</mat-label>
                <input matInput formControlName="checkPattern"
                  placeholder="e.g., /^[a-z][a-zA-Z0-9]*$/ for camelCase">
                <mat-hint>Regex pattern or text description of what to check</mat-hint>
              </mat-form-field>

              <div class="form-actions">
                <button mat-button type="button" (click)="resetForm()">
                  <mat-icon>refresh</mat-icon>
                  Reset
                </button>
                <button mat-raised-button color="primary" type="submit" [disabled]="!ruleForm.valid">
                  <mat-icon>{{ editingRule() ? 'save' : 'add' }}</mat-icon>
                  {{ editingRule() ? 'Update Rule' : 'Create Rule' }}
                </button>
              </div>
            </form>
          </div>
        </mat-tab>

        <mat-tab label="Import/Export">
          <div class="tab-content">
            <div class="import-export-section">
              <h3>Export Rules</h3>
              <p>Export your custom rules to share with your team or backup.</p>
              <button mat-raised-button color="primary" (click)="exportRules()">
                <mat-icon>download</mat-icon>
                Export All Rules (JSON)
              </button>

              <mat-divider style="margin: 24px 0;"></mat-divider>

              <h3>Import Rules</h3>
              <p>Import rules from a JSON file. Imported rules will be added to your existing rules.</p>
              <input type="file" #fileInput (change)="onFileSelected($event)" accept=".json" style="display: none;">
              <button mat-raised-button (click)="fileInput.click()">
                <mat-icon>upload</mat-icon>
                Import Rules from File
              </button>

              <mat-divider style="margin: 24px 0;"></mat-divider>

              <h3>Quick Start Templates</h3>
              <p>Load pre-built rule templates for common scenarios:</p>
              <div class="templates-grid">
                <button mat-stroked-button (click)="loadTemplate('company')">
                  <mat-icon>business</mat-icon>
                  Company Standards
                </button>
                <button mat-stroked-button (click)="loadTemplate('security')">
                  <mat-icon>security</mat-icon>
                  Security Rules
                </button>
                <button mat-stroked-button (click)="loadTemplate('performance')">
                  <mat-icon>speed</mat-icon>
                  Performance Rules
                </button>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
      <button mat-raised-button color="primary" mat-dialog-close [mat-dialog-close]="customRules()">
        <mat-icon>check</mat-icon>
        Apply Rules
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .close-button {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: white;
      }
    }

    mat-dialog-content {
      padding: 0;
      min-height: 500px;
      max-height: 70vh;
    }

    .tab-content {
      padding: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .rules-list {
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #999;

        mat-icon {
          font-size: 72px;
          width: 72px;
          height: 72px;
          margin-bottom: 16px;
        }
      }

      .rule-item {
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        margin-bottom: 12px;

        .rule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          h3 {
            margin: 0;
            font-size: 16px;
            color: #333;
          }

          .rule-actions {
            display: flex;
            gap: 8px;
            align-items: center;
          }
        }

        .rule-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;

          .severity-badge {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            color: white;

            &.severity-error { background-color: #f44336; }
            &.severity-warning { background-color: #ff9800; }
            &.severity-info { background-color: #2196f3; }
          }

          .category-badge {
            padding: 4px 12px;
            border-radius: 4px;
            background-color: #e8eaf6;
            color: #667eea;
            font-size: 11px;
            font-weight: 600;
          }
        }

        .rule-description {
          color: #666;
          font-size: 14px;
          margin: 0;
        }
      }
    }

    .import-export-section {
      h3 {
        color: #333;
        margin-bottom: 8px;
      }

      p {
        color: #666;
        margin-bottom: 16px;
      }

      button {
        margin-bottom: 16px;

        mat-icon {
          margin-right: 8px;
        }
      }

      .templates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;

        button {
          flex-direction: column;
          padding: 20px;
          height: auto;

          mat-icon {
            margin: 0 0 8px 0;
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class CustomRulesDialogComponent implements OnInit {
  customRules = signal<CustomRule[]>([]);
  editingRule = signal<CustomRule | null>(null);
  ruleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CustomRulesDialogComponent>,
    private customRulesService: CustomRulesService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.ruleForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Custom Rules', Validators.required],
      severity: ['warning', Validators.required],
      description: ['', Validators.required],
      rationale: ['', Validators.required],
      impact: ['', Validators.required],
      checkPattern: ['']
    });
  }

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.customRulesService.getCustomRules().subscribe(rules => {
      this.customRules.set(rules);
    });
  }

  saveRule(): void {
    if (!this.ruleForm.valid) return;

    const ruleData = {
      ...this.ruleForm.value,
      enabled: true
    };

    if (this.editingRule()) {
      this.customRulesService.updateCustomRule(this.editingRule()!.id, ruleData);
      this.snackBar.open('Rule updated successfully', 'Close', { duration: 3000 });
    } else {
      this.customRulesService.addCustomRule(ruleData);
      this.snackBar.open('Rule created successfully', 'Close', { duration: 3000 });
    }

    this.resetForm();
    this.loadRules();
  }

  editRule(rule: CustomRule): void {
    this.editingRule.set(rule);
    this.ruleForm.patchValue(rule);
  }

  deleteRule(id: string): void {
    if (confirm('Are you sure you want to delete this rule?')) {
      this.customRulesService.deleteCustomRule(id);
      this.snackBar.open('Rule deleted', 'Close', { duration: 3000 });
      this.loadRules();
    }
  }

  toggleRule(id: string): void {
    const enabled = this.customRulesService.toggleRuleEnabled(id);
    this.snackBar.open(enabled ? 'Rule enabled' : 'Rule disabled', 'Close', { duration: 2000 });
    this.loadRules();
  }

  resetForm(): void {
    this.ruleForm.reset({
      category: 'Custom Rules',
      severity: 'warning'
    });
    this.editingRule.set(null);
  }

  exportRules(): void {
    const json = this.customRulesService.exportRules(this.customRules());
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `custom-rules-${Date.now()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.snackBar.open('Rules exported successfully', 'Close', { duration: 3000 });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const count = this.customRulesService.importRules(e.target.result);
        this.snackBar.open(`${count} rules imported successfully`, 'Close', { duration: 3000 });
        this.loadRules();
      } catch (err) {
        this.snackBar.open('Failed to import rules', 'Close', { duration: 3000 });
      }
    };
    reader.readAsText(file);
  }

  loadTemplate(type: string): void {
    const templates: { [key: string]: Partial<CustomRule>[] } = {
      company: [
        {
          name: 'Use Company Naming Convention',
          category: 'Company Standards',
          severity: 'error',
          description: 'All API endpoints must follow company naming standards',
          rationale: 'Consistency across all company APIs improves maintainability',
          impact: 'Inconsistent naming confuses developers',
          checkPattern: '/company-standard/',
          enabled: true
        }
      ],
      security: [
        {
          name: 'Implement Request Signing',
          category: 'Security',
          severity: 'error',
          description: 'All requests must be signed with HMAC SHA-256',
          rationale: 'Request signing prevents tampering and replay attacks',
          impact: 'Unsigned requests can be modified by attackers',
          checkPattern: 'X-Signature header',
          enabled: true
        }
      ],
      performance: [
        {
          name: 'Response Time Under 200ms',
          category: 'Performance',
          severity: 'warning',
          description: 'All endpoints must respond within 200ms (p95)',
          rationale: 'Fast response times improve user experience',
          impact: 'Slow APIs cause timeouts and poor UX',
          checkPattern: 'p95 < 200ms',
          enabled: true
        }
      ]
    };

    const template = templates[type];
    if (template) {
      template.forEach(rule => {
        this.customRulesService.addCustomRule(rule as any);
      });
      this.snackBar.open(`${template.length} template rules added`, 'Close', { duration: 3000 });
      this.loadRules();
    }
  }
}

