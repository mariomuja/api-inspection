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
      name: 'REST Countries',
      url: 'https://restcountries.com/v3.1',
      description: 'Get information about countries via a RESTful API. Includes data about population, area, languages, and more.'
    },
    {
      id: '6',
      name: 'The Cat API',
      url: 'https://api.thecatapi.com/v1',
      description: 'Cat images and breed information API. Perfect for cat lovers and testing image-based APIs.'
    },
    {
      id: '7',
      name: 'Bored API',
      url: 'https://www.boredapi.com/api',
      description: 'Helps you find things to do when you\'re bored. Simple API with activity suggestions.'
    },
    {
      id: '8',
      name: 'GitHub API',
      url: 'https://api.github.com',
      description: 'Access GitHub data including repositories, users, issues, and more. Well-documented REST API.'
    },
    {
      id: '9',
      name: 'Open Library API',
      url: 'https://openlibrary.org/api',
      description: 'Access book data, covers, and bibliographic information from the Internet Archive.'
    },
    {
      id: '10',
      name: 'CoinGecko API',
      url: 'https://api.coingecko.com/api/v3',
      description: 'Cryptocurrency data API. Get prices, market data, and historical information.'
    },
    {
      id: '11',
      name: 'Random User API',
      url: 'https://randomuser.me/api',
      description: 'Generate random user data including names, emails, addresses, and profile pictures.'
    },
    {
      id: '12',
      name: 'Quote Garden API',
      url: 'https://quote-garden.onrender.com/api/v3',
      description: 'Collection of inspirational quotes. Simple API for retrieving random or specific quotes.'
    },
    {
      id: '13',
      name: 'PokéAPI',
      url: 'https://pokeapi.co/api/v2',
      description: 'Comprehensive Pokémon data API. Includes data on all Pokémon, moves, abilities, and more.'
    },
    {
      id: '14',
      name: 'Advice Slip API',
      url: 'https://api.adviceslip.com',
      description: 'Random advice generator API. Get random pieces of advice or search for specific topics.'
    },
    {
      id: '15',
      name: 'JSON Server API',
      url: 'https://my-json-server.typicode.com/typicode/demo',
      description: 'Fake Online REST server for testing and prototyping. Based on JSON Server.'
    },
    {
      id: '16',
      name: 'IP API',
      url: 'https://ipapi.co/json',
      description: 'IP geolocation API. Get location information based on IP address.'
    },
    {
      id: '17',
      name: 'Numbers API',
      url: 'http://numbersapi.com',
      description: 'Interesting facts about numbers. Get trivia, math facts, date facts, and more.'
    },
    {
      id: '18',
      name: 'Zippopotam.us',
      url: 'http://api.zippopotam.us',
      description: 'Postal and zip code information API. Get location data from postal codes.'
    },
    {
      id: '19',
      name: 'Agify.io',
      url: 'https://api.agify.io',
      description: 'Predict age based on a name. Simple API that estimates age from given names.'
    },
    {
      id: '20',
      name: 'Genderize.io',
      url: 'https://api.genderize.io',
      description: 'Predict gender based on a name. Determines likely gender from given names.'
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

