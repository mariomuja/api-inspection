import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiInspectorComponent } from './components/api-inspector.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ApiInspectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'API Design Inspector';
}
