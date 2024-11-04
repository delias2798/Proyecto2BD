import { Component } from '@angular/core';
import { Neo4jService } from '../neo4j.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.css'
})
export class ConsultasComponent {

  tecnologia = '';
  cantidadAplicaciones: number | null = null;

  tituloAplicacion = ''; // Título de la aplicación para buscar aplicaciones similares
  aplicacionesSimilares: { titulo: string, coincidencias: number }[] = [];

  nombreCreador = '';
  aplicacionesPorCreador: string[] = [];

  topTecnologias: { tecnologia: string, cantidadAplicaciones: number }[] = [];

  tecnologiasSeleccionadasString = ''; // Usado para la entrada de texto
  creadoresNuncaJuntos: { desarrollador1: string, desarrollador2: string }[] = [];

  constructor(private neo4jService: Neo4jService) {}

  obtenerCantidadAplicaciones() {
    if (this.tecnologia) {
      this.neo4jService.getCantidadAplicacionesPorTecnologia(this.tecnologia).subscribe(
        (data) => this.cantidadAplicaciones = data.cantidadAplicaciones,
        (error) => console.error('Error fetching data:', error)
      );
    }
  }

  obtenerAplicacionesSimilares() {
    if (this.tituloAplicacion) {
      this.neo4jService.getAplicacionesSimilares(this.tituloAplicacion).subscribe(
        (data) => this.aplicacionesSimilares = data,
        (error) => console.error('Error fetching data:', error)
      );
    }
  }


  obtenerAplicacionesPorCreador() {
    if (this.nombreCreador) {
      this.neo4jService.getAplicacionesPorCreador(this.nombreCreador).subscribe(
        (data) => this.aplicacionesPorCreador = data,
        (error) => console.error('Error fetching data:', error)
      );
    }
  }

  obtenerTopTecnologias() {
    this.neo4jService.getTopTecnologias().subscribe(
      (data) => this.topTecnologias = data,
      (error) => console.error('Error fetching data:', error)
    );
  }

  obtenerCreadoresNuncaJuntos() {
    const tecnologiasSeleccionadas = this.tecnologiasSeleccionadasString.split(',').map(t => t.trim());
    if (tecnologiasSeleccionadas.length >= 2) {  // Asegura que haya al menos dos tecnologías
      this.neo4jService.getCreadoresNuncaJuntos(tecnologiasSeleccionadas).subscribe(
        (data) => this.creadoresNuncaJuntos = data,
        (error) => console.error('Error fetching data:', error)
      );
    } else {
      alert('Debe seleccionar al menos dos tecnologías.');
    }
  }

}
