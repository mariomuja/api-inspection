import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiInspectorComponent } from './components/api-inspector.component';
import { ImpressumComponent } from './components/impressum.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ApiInspectorComponent, ImpressumComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'API Inspector';
}
