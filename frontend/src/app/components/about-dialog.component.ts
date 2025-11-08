import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>help</mat-icon>
      About API Design Inspector
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content>
      <div class="about-content">
        <section class="intro">
          <h3>🔍 What is API Design Inspector?</h3>
          <p>
            API Design Inspector is a comprehensive tool that analyzes RESTful web service APIs 
            against industry-standard design guidelines and best practices. It helps developers 
            and API architects ensure their APIs are well-designed, secure, and follow established 
            conventions from leading tech companies and standards organizations.
          </p>
        </section>

        <section class="how-it-works">
          <h3>⚙️ How It Works</h3>
          <ol>
            <li><strong>Select or Enter API:</strong> Choose from 40 pre-configured public APIs or enter your own API URL</li>
            <li><strong>Choose Standards:</strong> Validate against specific sources (Google, Microsoft, OWASP, etc.) or all standards</li>
            <li><strong>Instant Analysis:</strong> The tool tests multiple HTTP methods and analyzes API responses</li>
            <li><strong>Detailed Report:</strong> Receive comprehensive feedback with severity levels, recommendations, and authoritative sources</li>
            <li><strong>Export Results:</strong> Download reports in PDF, Markdown, HTML, CSV, JSON, or issue tracker formats</li>
          </ol>
        </section>

        <section class="goals">
          <h3>🎯 Goals & Objectives</h3>
          <ul>
            <li><strong>Improve API Quality:</strong> Identify design flaws and inconsistencies early in development</li>
            <li><strong>Ensure Compliance:</strong> Validate APIs against recognized industry standards</li>
            <li><strong>Educate Developers:</strong> Learn best practices through actionable feedback</li>
            <li><strong>Save Time:</strong> Automated analysis instead of manual code reviews</li>
            <li><strong>Standardize Design:</strong> Maintain consistency across organization APIs</li>
          </ul>
        </section>

        <section class="advantages">
          <h3>✨ Key Advantages</h3>
          <div class="advantages-grid">
            <div class="advantage-card">
              <mat-icon>speed</mat-icon>
              <h4>Fast & Efficient</h4>
              <p>Analyze any API in seconds with real-time feedback</p>
            </div>

            <div class="advantage-card">
              <mat-icon>verified_user</mat-icon>
              <h4>Authoritative Sources</h4>
              <p>Rules from Google, Microsoft, OWASP, IETF, and other industry leaders</p>
            </div>

            <div class="advantage-card">
              <mat-icon>security</mat-icon>
              <h4>Security Focused</h4>
              <p>Detects vulnerabilities and missing security headers</p>
            </div>

            <div class="advantage-card">
              <mat-icon>cloud_done</mat-icon>
              <h4>No Installation</h4>
              <p>100% web-based, works in any browser</p>
            </div>

            <div class="advantage-card">
              <mat-icon>lock</mat-icon>
              <h4>Privacy First</h4>
              <p>No data stored on servers, all analysis is ephemeral</p>
            </div>

            <div class="advantage-card">
              <mat-icon>settings</mat-icon>
              <h4>Customizable</h4>
              <p>Create your own rules and validation standards</p>
            </div>

            <div class="advantage-card">
              <mat-icon>download</mat-icon>
              <h4>Multiple Exports</h4>
              <p>8 different export formats including GitHub and JIRA</p>
            </div>

            <div class="advantage-card">
              <mat-icon>vpn_key</mat-icon>
              <h4>Auth Support</h4>
              <p>Analyze private APIs with API keys, OAuth, and JWT</p>
            </div>
          </div>
        </section>

        <section class="use-cases">
          <h3>💼 Who Benefits?</h3>
          <ul>
            <li><strong>API Developers:</strong> Validate design before deployment and catch mistakes early</li>
            <li><strong>DevOps Teams:</strong> Ensure APIs meet organizational standards</li>
            <li><strong>API Consumers:</strong> Evaluate third-party APIs before integration</li>
            <li><strong>Technical Leaders:</strong> Enforce consistent API design across teams</li>
            <li><strong>Educators:</strong> Teach REST API best practices with concrete examples</li>
          </ul>
        </section>

        <section class="rules">
          <h3>📋 What Gets Analyzed?</h3>
          <div class="rules-list">
            <span class="rule-badge">REST Principles</span>
            <span class="rule-badge">HTTP Standards</span>
            <span class="rule-badge">Security</span>
            <span class="rule-badge">Performance</span>
            <span class="rule-badge">Data Types</span>
            <span class="rule-badge">Validation</span>
            <span class="rule-badge">Error Handling</span>
            <span class="rule-badge">Naming Conventions</span>
            <span class="rule-badge">Versioning</span>
            <span class="rule-badge">Documentation</span>
            <span class="rule-badge">CORS</span>
            <span class="rule-badge">Pagination</span>
          </div>
          <p class="rules-count">
            <strong>40+ design rules</strong> from 12+ authoritative sources
          </p>
        </section>

        <section class="get-started">
          <h3>🚀 Get Started</h3>
          <p>
            Simply select a public API from the dropdown or enter your own API URL, 
            choose which standards to validate against, and click "Analyze API". 
            Results appear in seconds with detailed recommendations and export options.
          </p>
        </section>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>
        <mat-icon>check</mat-icon>
        Got It!
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
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
      color: #333;
      position: relative;
      font-weight: 600;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #333;
      }

      .close-button {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: #333;
      }
    }

    mat-dialog-content {
      padding: 0;
      max-height: 75vh;
      overflow-y: auto;
    }

    .about-content {
      padding: 24px;

      section {
        margin-bottom: 32px;

        &:last-child {
          margin-bottom: 0;
        }

        h3 {
          color: #667eea;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        p {
          color: #555;
          line-height: 1.7;
          margin: 0 0 12px 0;
        }

        ul, ol {
          color: #555;
          line-height: 1.8;
          margin: 0;
          padding-left: 24px;

          li {
            margin-bottom: 8px;

            strong {
              color: #333;
            }
          }
        }
      }

      .intro {
        background: linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 100%);
        padding: 20px;
        border-radius: 12px;
        border-left: 4px solid #667eea;
      }

      .advantages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-top: 16px;

        .advantage-card {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          transition: all 0.2s ease;
          border: 1px solid #e0e0e0;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
            border-color: #667eea;
          }

          mat-icon {
            font-size: 36px;
            width: 36px;
            height: 36px;
            color: #667eea;
            margin-bottom: 8px;
          }

          h4 {
            margin: 0 0 8px 0;
            color: #333;
            font-size: 15px;
            font-weight: 600;
          }

          p {
            margin: 0;
            font-size: 13px;
            color: #666;
            line-height: 1.4;
          }
        }
      }

      .rules-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;

        .rule-badge {
          padding: 6px 14px;
          background: #e8eaf6;
          color: #667eea;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #c5cae9;
        }
      }

      .rules-count {
        text-align: center;
        padding: 16px;
        background: #fff3e0;
        border-radius: 8px;
        color: #e65100;
        border: 1px solid #ffcc80;
      }

      .get-started {
        background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
        padding: 20px;
        border-radius: 12px;
        border-left: 4px solid #4caf50;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      background: #fafafa;

      button mat-icon {
        margin-right: 6px;
      }
    }

    @media (max-width: 768px) {
      .advantages-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AboutDialogComponent>
  ) {}
}

