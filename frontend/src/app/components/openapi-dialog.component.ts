import { Component, Inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-openapi-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>description</mat-icon>
      OpenAPI Specification
      <button mat-icon-button mat-dialog-close class="close-button">
        <mat-icon>close</mat-icon>
      </button>
    </h2>
    
    <mat-dialog-content>
      <div class="spec-info" *ngIf="spec()">
        <div class="info-row">
          <strong>API:</strong> {{ spec().info?.title || 'Unknown API' }}
        </div>
        <div class="info-row" *ngIf="spec().info?.version">
          <strong>Version:</strong> {{ spec().info.version }}
        </div>
        <div class="info-row" *ngIf="spec().info?.description">
          <strong>Description:</strong> {{ spec().info.description }}
        </div>
      </div>

      <mat-tab-group *ngIf="spec()">
        <mat-tab label="Highlighted Endpoint">
          <div class="tab-content">
            <div class="endpoint-highlight" *ngIf="highlightedPath()">
              <h3>{{ highlightedEndpoint() }}</h3>
              <div class="path-details">
                <div *ngFor="let method of getPathMethods()" class="method-section">
                  <div class="method-header">
                    <span [class]="'method-badge method-' + method.toLowerCase()">
                      {{ method.toUpperCase() }}
                    </span>
                    <span class="summary">{{ getMethodSummary(method) }}</span>
                  </div>
                  
                  <div class="method-content">
                    <div class="description" *ngIf="getMethodDescription(method)">
                      {{ getMethodDescription(method) }}
                    </div>
                    
                    <div class="parameters" *ngIf="getMethodParameters(method) && getMethodParameters(method).length > 0">
                      <strong>Parameters:</strong>
                      <ul>
                        <li *ngFor="let param of getMethodParameters(method)">
                          <code>{{ param.name }}</code> ({{ param.in }}) - 
                          {{ param.required ? 'Required' : 'Optional' }} - 
                          {{ param.description || 'No description' }}
                        </li>
                      </ul>
                    </div>

                    <div class="responses" *ngIf="getMethodResponses(method)">
                      <strong>Responses:</strong>
                      <ul>
                        <li *ngFor="let status of getResponseStatuses(method)">
                          <span class="status-code">{{ status }}</span> - 
                          {{ getResponseDescription(method, status) }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="!highlightedPath()" class="no-endpoint">
              <mat-icon>info</mat-icon>
              <p>Endpoint not found in OpenAPI specification</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="All Endpoints">
          <div class="tab-content">
            <div class="all-endpoints" *ngIf="spec()?.paths">
              <div *ngFor="let pathKey of getPathKeys()" class="endpoint-item">
                <h4>{{ pathKey }}</h4>
                <div *ngFor="let method of getAllPathMethods(pathKey)" class="method-section">
                  <div class="method-header">
                    <span [class]="'method-badge method-' + method.toLowerCase()">
                      {{ method.toUpperCase() }}
                    </span>
                    <span class="summary">{{ getPathMethodSummary(pathKey, method) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Full Specification">
          <div class="tab-content">
            <pre class="spec-json">{{ formatSpec() }}</pre>
          </div>
        </mat-tab>
      </mat-tab-group>

      <div *ngIf="!spec()" class="no-spec">
        <mat-icon>warning</mat-icon>
        <p>No OpenAPI specification available</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
      <button mat-raised-button color="primary" *ngIf="spec()" (click)="downloadSpec()">
        <mat-icon>download</mat-icon>
        Download Spec
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
      min-height: 400px;
    }

    .spec-info {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;

      .info-row {
        margin-bottom: 8px;
        
        strong {
          color: #667eea;
          margin-right: 8px;
        }
      }
    }

    .tab-content {
      padding: 20px 0;
    }

    .all-endpoints {
      .endpoint-item {
        margin-bottom: 24px;
        padding: 16px;
        background-color: #fafafa;
        border-radius: 8px;
        border-left: 4px solid #667eea;

        h4 {
          color: #667eea;
          font-size: 18px;
          font-family: 'Courier New', monospace;
          margin: 0 0 12px 0;
        }

        .method-section {
          margin-bottom: 8px;
          padding: 8px;
          background-color: white;
          border-radius: 4px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .endpoint-highlight {
      h3 {
        color: #667eea;
        font-size: 20px;
        margin-bottom: 16px;
        font-family: 'Courier New', monospace;
      }

      .method-section {
        margin-bottom: 24px;
        padding: 16px;
        background-color: #fafafa;
        border-radius: 8px;
        border-left: 4px solid #667eea;

        .method-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          .method-badge {
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            color: white;

            &.method-get { background-color: #4caf50; }
            &.method-post { background-color: #2196f3; }
            &.method-put { background-color: #ff9800; }
            &.method-patch { background-color: #9c27b0; }
            &.method-delete { background-color: #f44336; }
          }

          .summary {
            font-weight: 500;
            color: #333;
          }
        }

        .method-content {
          padding-left: 12px;

          .description {
            margin-bottom: 16px;
            color: #666;
            line-height: 1.6;
          }

          strong {
            display: block;
            margin: 12px 0 8px 0;
            color: #333;
          }

          ul {
            margin: 0;
            padding-left: 20px;

            li {
              margin-bottom: 8px;
              color: #555;
              line-height: 1.5;

              code {
                background-color: #e8eaf6;
                padding: 2px 6px;
                border-radius: 3px;
                color: #667eea;
                font-weight: 600;
              }

              .status-code {
                background-color: #e8f5e9;
                padding: 2px 8px;
                border-radius: 3px;
                color: #4caf50;
                font-weight: 600;
                font-family: monospace;
              }
            }
          }
        }
      }
    }

    .spec-json {
      background-color: #1e1e1e;
      color: #d4d4d4;
      padding: 20px;
      border-radius: 8px;
      overflow: auto;
      max-height: 60vh;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
    }

    .no-endpoint, .no-spec {
      text-align: center;
      padding: 60px 20px;
      color: #999;

      mat-icon {
        font-size: 72px;
        width: 72px;
        height: 72px;
        margin-bottom: 16px;
        color: #ccc;
      }

      p {
        font-size: 16px;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;

      button mat-icon {
        margin-right: 8px;
      }
    }
  `]
})
export class OpenApiDialogComponent implements OnInit {
  spec = signal<any>(null);
  highlightedEndpoint = signal<string>('');
  highlightedPath = signal<any>(null);

  constructor(
    public dialogRef: MatDialogRef<OpenApiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.spec.set(this.data.spec);
    this.highlightedEndpoint.set(this.data.highlightEndpoint);
    
    // Find the matching path in OpenAPI spec
    if (this.spec() && this.spec().paths) {
      const endpoint = this.highlightedEndpoint();
      const paths = this.spec().paths;
      
      // Try exact match first
      if (paths[endpoint]) {
        this.highlightedPath.set(paths[endpoint]);
      } else {
        // Try to find similar path
        const similarPath = Object.keys(paths).find(p => 
          p.includes(endpoint) || endpoint.includes(p.replace(/\{.*?\}/g, ''))
        );
        if (similarPath) {
          this.highlightedPath.set(paths[similarPath]);
        }
      }
    }
  }

  getPathMethods(): string[] {
    const path = this.highlightedPath();
    if (!path) return [];
    return Object.keys(path).filter(k => 
      ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(k.toLowerCase())
    );
  }

  getMethodSummary(method: string): string {
    const path = this.highlightedPath();
    return path?.[method]?.summary || path?.[method]?.operationId || 'No summary';
  }

  getMethodDescription(method: string): string {
    const path = this.highlightedPath();
    return path?.[method]?.description || '';
  }

  getMethodParameters(method: string): any[] {
    const path = this.highlightedPath();
    return path?.[method]?.parameters || [];
  }

  getMethodResponses(method: string): any {
    const path = this.highlightedPath();
    return path?.[method]?.responses;
  }

  getResponseStatuses(method: string): string[] {
    const responses = this.getMethodResponses(method);
    return responses ? Object.keys(responses) : [];
  }

  getResponseDescription(method: string, status: string): string {
    const responses = this.getMethodResponses(method);
    return responses?.[status]?.description || 'No description';
  }

  formatSpec(): string {
    return JSON.stringify(this.spec(), null, 2);
  }

  downloadSpec(): void {
    const dataStr = this.formatSpec();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'openapi-spec.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  getPathKeys(): string[] {
    const spec = this.spec();
    return spec?.paths ? Object.keys(spec.paths) : [];
  }

  getAllPathMethods(pathKey: string): string[] {
    const spec = this.spec();
    const path = spec?.paths?.[pathKey];
    if (!path) return [];
    return Object.keys(path).filter(k => 
      ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(k.toLowerCase())
    );
  }

  getPathMethodSummary(pathKey: string, method: string): string {
    const spec = this.spec();
    const path = spec?.paths?.[pathKey];
    return path?.[method]?.summary || path?.[method]?.description || 'No description';
  }
}

