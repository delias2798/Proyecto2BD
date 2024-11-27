import { Component } from '@angular/core';
import { Neo4jService } from '../neo4j.service'; // Asegúrate de tener el servicio para conectar con Neo4j
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-create-node',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-node.component.html',
  styleUrls: ['./create-node.component.css'],
})
export class CreateNodeComponent {
  // Variables para capturar la entrada del usuario
  titulo: string = '';
  whatItDoes: string = '';
  builtWith: string = '';
  by: string = '';
  location: string = '';

  constructor(private neo4jService: Neo4jService) {}

  // Método para enviar los datos a Neo4j
  crearNodo() {
    const nuevoProyecto = {
      titulo: this.titulo,
      whatItDoes: this.whatItDoes,
      builtWith: this.builtWith,
      by: this.by,
      location: this.location
    };

    this.neo4jService.createNode('Proyecto', nuevoProyecto).subscribe(
      (response) => {
        console.log('Nodo creado exitosamente:', response);
        // Opcional: Agregar lógica adicional después de crear el nodo
      },
      (error) => {
        console.error('Error al crear el nodo:', error);
      }
    );
  }
}
