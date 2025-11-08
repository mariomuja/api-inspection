import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface AuthConfig {
  type: 'none' | 'api-key' | 'bearer' | 'basic' | 'oauth';
  apiKey?: string;
  apiKeyHeader?: string;
  bearerToken?: string;
  username?: string;
  password?: string;
  oauthToken?: string;
}

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatSlideToggleModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>vpn_key</mat-icon>
      API Authentication
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </h2>

    <mat-dialog-content>
      <p class="description">
        Configure authentication to analyze private or protected APIs.
        Credentials are stored locally and never sent to our servers.
      </p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Authentication Type</mat-label>
        <mat-select [(ngModel)]="authConfig().type">
          <mat-option value="none">No Authentication</mat-option>
          <mat-option value="api-key">API Key</mat-option>
          <mat-option value="bearer">Bearer Token (JWT)</mat-option>
          <mat-option value="basic">Basic Auth</mat-option>
          <mat-option value="oauth">OAuth 2.0 Token</mat-option>
        </mat-select>
        <mat-icon matPrefix>security</mat-icon>
      </mat-form-field>

      <!-- API Key -->
      <div *ngIf="authConfig().type === 'api-key'" class="auth-section">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>API Key Header Name</mat-label>
          <input matInput [(ngModel)]="authConfig().apiKeyHeader" placeholder="e.g., X-API-Key">
          <mat-hint>The header name where the API key should be sent</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>API Key Value</mat-label>
          <input matInput type="password" [(ngModel)]="authConfig().apiKey" placeholder="Enter your API key">
          <mat-icon matPrefix>key</mat-icon>
        </mat-form-field>
      </div>

      <!-- Bearer Token -->
      <div *ngIf="authConfig().type === 'bearer'" class="auth-section">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Bearer Token</mat-label>
          <textarea matInput [(ngModel)]="authConfig().bearerToken" rows="4"
            placeholder="Enter your JWT or bearer token"></textarea>
          <mat-icon matPrefix>token</mat-icon>
          <mat-hint>Will be sent as: Authorization: Bearer [token]</mat-hint>
        </mat-form-field>
      </div>

      <!-- Basic Auth -->
      <div *ngIf="authConfig().type === 'basic'" class="auth-section">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Username</mat-label>
          <input matInput [(ngModel)]="authConfig().username" placeholder="Enter username">
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput type="password" [(ngModel)]="authConfig().password" placeholder="Enter password">
          <mat-icon matPrefix>lock</mat-icon>
          <mat-hint>Will be sent as: Authorization: Basic [base64(username:password)]</mat-hint>
        </mat-form-field>
      </div>

      <!-- OAuth -->
      <div *ngIf="authConfig().type === 'oauth'" class="auth-section">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>OAuth Access Token</mat-label>
          <textarea matInput [(ngModel)]="authConfig().oauthToken" rows="4"
            placeholder="Enter your OAuth 2.0 access token"></textarea>
          <mat-icon matPrefix>verified_user</mat-icon>
          <mat-hint>Will be sent as: Authorization: Bearer [token]</mat-hint>
        </mat-form-field>
      </div>

      <div class="info-box">
        <mat-icon>info</mat-icon>
        <div>
          <strong>Security Note:</strong> 
          Credentials are stored in your browser's local storage only. They are sent directly 
          from your browser to the API being analyzed, never through our servers.
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="clearAuth()">
        <mat-icon>delete</mat-icon>
        Clear
      </button>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="authConfig()">
        <mat-icon>save</mat-icon>
        Save Configuration
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
      padding: 24px;
    }

    .description {
      color: #666;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .auth-section {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background-color: #e3f2fd;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
      margin-top: 24px;

      mat-icon {
        color: #2196f3;
        flex-shrink: 0;
      }

      div {
        font-size: 13px;
        line-height: 1.5;

        strong {
          display: block;
          margin-bottom: 4px;
          color: #1565c0;
        }
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;

      button mat-icon {
        margin-right: 6px;
      }
    }
  `]
})
export class AuthDialogComponent {
  authConfig = signal<AuthConfig>({
    type: 'none'
  });

  constructor(
    public dialogRef: MatDialogRef<AuthDialogComponent>
  ) {
    // Load from localStorage if exists
    this.loadAuthConfig();
  }

  loadAuthConfig(): void {
    try {
      const stored = localStorage.getItem('api-inspector-auth');
      if (stored) {
        this.authConfig.set(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading auth config:', err);
    }
  }

  clearAuth(): void {
    this.authConfig.set({ type: 'none' });
    localStorage.removeItem('api-inspector-auth');
  }

  ngOnDestroy(): void {
    // Save auth config when dialog closes
    if (this.authConfig().type !== 'none') {
      localStorage.setItem('api-inspector-auth', JSON.stringify(this.authConfig()));
    }
  }
}

