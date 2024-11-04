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

  getCantidadAplicacionesPorTecnologia(tecnologia: string): Observable<{ cantidadAplicaciones: number }> {
    return this.http.get<{ cantidadAplicaciones: number }>(`${this.apiUrl}/consultas/cantidadAplicacionesPorTecnologia`, {
      params: { tecnologia }
    });
  }

  getAplicacionesSimilares(titulo: string): Observable<{ titulo: string, coincidencias: number }[]> {
    return this.http.get<{ titulo: string, coincidencias: number }[]>(`${this.apiUrl}/consultas/aplicacionesSimilares`, {
      params: { titulo }
    });
  }

  getAplicacionesPorCreador(nombreD: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/consultas/aplicacionesPorCreador`, {
      params: { nombreD }
    });
  }
  
  getTopTecnologias(): Observable<{ tecnologia: string, cantidadAplicaciones: number }[]> {
    return this.http.get<{ tecnologia: string, cantidadAplicaciones: number }[]>(`${this.apiUrl}/consultas/topTecnologias`);
  }
  
  getCreadoresNuncaJuntos(tecnologiasSeleccionadas: string[]): Observable<{ desarrollador1: string, desarrollador2: string }[]> {
    return this.http.get<{ desarrollador1: string, desarrollador2: string }[]>(`${this.apiUrl}/consultas/creadoresNuncaJuntos`, {
      params: { tecnologiasSeleccionadas: tecnologiasSeleccionadas.join(',') }
    });
  }
  

  
}