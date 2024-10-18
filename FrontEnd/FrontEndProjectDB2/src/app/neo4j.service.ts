import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Neo4jService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your backend URL
  constructor(private http: HttpClient) { }
  createNode(name: string, age: number): Observable<any> {
    const body = { name, age };
    return this.http.post(`${this.apiUrl}/createNode`, body);
  }
}