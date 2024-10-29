import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class Neo4jService {

  private apiUrl = 'http://localhost:3000/api'; // Update with your backend URL
  
  constructor(private http: HttpClient) { }

  loadCsv(): Observable<any> {
    return this.http.post(`${this.apiUrl}/loadCsv`, {});
  }

  getGraphData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nodes`);
  }

  getNodes(type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/nodes/${type}`);
  }

  getNode(type: string, id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/node/${type}/${id}`);
  }

  createNode(type: string, properties: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/node/${type}`, { properties });
  }

  updateNode(type: string, id: string, properties: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/node/${type}/${id}`, { properties });
  }

  deleteNode(type: string, id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/node/${type}/${id}`);
  }
}