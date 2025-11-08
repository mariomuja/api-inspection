import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiAnalysisResult, WebService } from '../models/web-service.model';

@Injectable({
  providedIn: 'root'
})
export class ApiAnalysisService {
  private readonly apiUrl = '/api';

  private readonly sampleServices: WebService[] = [
    {
      id: '1',
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
      description: 'Free fake REST API for testing and prototyping. Provides endpoints for posts, comments, albums, photos, todos, and users.'
    },
    {
      id: '2',
      name: 'REQ|RES',
      url: 'https://reqres.in/api',
      description: 'A hosted REST-API ready to respond to your AJAX requests. Perfect for testing frontend applications.'
    },
    {
      id: '3',
      name: 'Dog API',
      url: 'https://dog.ceo/api',
      description: 'The internet\'s biggest collection of open source dog pictures. Public API with no authentication required.'
    },
    {
      id: '4',
      name: 'Fake Store API',
      url: 'https://fakestoreapi.com',
      description: 'Fake REST API for your e-commerce or shopping website prototype. Includes products, carts, and users.'
    },
    {
      id: '5',
      name: 'OpenWeather API',
      url: 'https://api.openweathermap.org/data/2.5',
      description: 'Weather data API providing current weather, forecasts, and historical data. (Note: May require API key)'
    },
    {
      id: '6',
      name: 'REST Countries',
      url: 'https://restcountries.com/v3.1',
      description: 'Get information about countries via a RESTful API. Includes data about population, area, languages, and more.'
    }
  ];

  constructor(private http: HttpClient) {}

  getAvailableServices(): Observable<WebService[]> {
    return of(this.sampleServices);
  }

  analyzeApi(serviceUrl: string): Observable<ApiAnalysisResult> {
    return this.http.post<ApiAnalysisResult>(`${this.apiUrl}/analyze`, { serviceUrl });
  }
}

