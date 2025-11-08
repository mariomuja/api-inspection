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
    },
    {
      id: '21',
      name: 'Nationalize.io',
      url: 'https://api.nationalize.io',
      description: 'Predict nationality based on a name. Determines likely country of origin from given names.'
    },
    {
      id: '22',
      name: 'JSONServe',
      url: 'https://jsonserve.com/api/v1',
      description: 'Free fake REST API for prototyping and testing. No registration required.'
    },
    {
      id: '23',
      name: 'Random Data API',
      url: 'https://random-data-api.com/api',
      description: 'Generate random realistic data for testing. Includes users, addresses, and more.'
    },
    {
      id: '24',
      name: 'DummyJSON',
      url: 'https://dummyjson.com',
      description: 'Free fake REST API with realistic data for testing and prototyping.'
    },
    {
      id: '25',
      name: 'CoinCap API',
      url: 'https://api.coincap.io/v2',
      description: 'Real-time cryptocurrency pricing data and market information.'
    },
    {
      id: '26',
      name: 'REST Countries v2',
      url: 'https://restcountries.com/v2',
      description: 'Alternative version of REST Countries API with different response structure.'
    },
    {
      id: '27',
      name: 'Star Wars API (SWAPI)',
      url: 'https://swapi.dev/api',
      description: 'The Star Wars API. All the Star Wars data you need: films, people, planets, starships.'
    },
    {
      id: '28',
      name: 'Rick and Morty API',
      url: 'https://rickandmortyapi.com/api',
      description: 'RESTful API based on the Rick and Morty television show. Characters, episodes, locations.'
    },
    {
      id: '29',
      name: 'Chuck Norris API',
      url: 'https://api.chucknorris.io',
      description: 'Free JSON API for hand curated Chuck Norris facts. No authentication required.'
    },
    {
      id: '30',
      name: 'Breaking Bad API',
      url: 'https://breakingbadapi.com/api',
      description: 'Information about Breaking Bad characters, episodes, quotes, and deaths.'
    },
    {
      id: '31',
      name: 'Game of Thrones API',
      url: 'https://anapioficeandfire.com/api',
      description: 'An API of Ice And Fire. All the data from the universe of Ice and Fire.'
    },
    {
      id: '32',
      name: 'Studio Ghibli API',
      url: 'https://ghibliapi.herokuapp.com',
      description: 'Studio Ghibli API catalogs films, characters, locations, and species from their films.'
    },
    {
      id: '33',
      name: 'Marvel API',
      url: 'https://gateway.marvel.com/v1/public',
      description: 'Marvel Comics API. Access data about Marvel characters, comics, and creators. (Requires API key)'
    },
    {
      id: '34',
      name: 'Open Trivia DB',
      url: 'https://opentdb.com/api.php',
      description: 'Free trivia questions database API. Get random trivia questions for games and quizzes.'
    },
    {
      id: '35',
      name: 'Jokes API',
      url: 'https://v2.jokeapi.dev',
      description: 'REST API for serving uniformly and well formatted jokes. Multiple categories available.'
    },
    {
      id: '36',
      name: 'Cat Facts API',
      url: 'https://catfact.ninja',
      description: 'Daily cat facts! Get random or specific cat facts from the database.'
    },
    {
      id: '37',
      name: 'Dog Facts API',
      url: 'https://dog-api.kinduff.com/api/facts',
      description: 'Random dog facts API. Learn interesting facts about dogs.'
    },
    {
      id: '38',
      name: 'Quotes API',
      url: 'https://api.quotable.io',
      description: 'Random famous quotes API. Get inspirational and motivational quotes.'
    },
    {
      id: '39',
      name: 'Kanye Rest',
      url: 'https://api.kanye.rest',
      description: 'Random Kanye West quotes. Get a dose of Kanye wisdom with each request.'
    },
    {
      id: '40',
      name: 'Ron Swanson Quotes',
      url: 'https://ron-swanson-quotes.herokuapp.com/v2/quotes',
      description: 'Random Ron Swanson quotes from Parks and Recreation TV show.'
    }
  ];

  constructor(private http: HttpClient) {}

  getAvailableServices(): Observable<WebService[]> {
    return of(this.sampleServices);
  }

  analyzeApi(serviceUrl: string, sourceFilter?: string): Observable<ApiAnalysisResult> {
    return this.http.post<ApiAnalysisResult>(`${this.apiUrl}/analyze`, { 
      serviceUrl,
      sourceFilter: sourceFilter || 'all'
    });
  }

  getOpenApiSpec(serviceUrl: string): Observable<any> {
    // Request the backend to fetch or generate OpenAPI spec
    return this.http.post<any>(`${this.apiUrl}/openapi`, { serviceUrl });
  }
}

