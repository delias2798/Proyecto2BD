import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Neo4jService } from '../neo4j.service';
import cytoscape from 'cytoscape';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements AfterViewInit {
  selectedType: string = 'Proyecto';
  nodes: any[] = [];
  filteredNodes: any[] = [];
  searchTerm: string = '';
  selectedNode: any = null;
  creatingNode: boolean = false;
  newProperties: any = {};

  constructor(
    private neo4jService: Neo4jService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGraph();
    }
  }

  loadGraph() {
    this.neo4jService.getGraphData().subscribe(data => {
      const elements = [
        ...data.nodes.map((node: any) => ({
          data: { id: node.id, label: node.label, ...node.properties }
        })),
        ...data.edges.map((edge: any) => ({
          data: { source: edge.from, target: edge.to, label: edge.label }
        }))
      ];

      const container = document.getElementById('graphContainer');
      if (container) {
        const cy = cytoscape({
          container,
          elements,
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#0074D9',
                'label': 'data(label)',
                'font-size': '8px',
                'text-valign': 'center',
                'color': '#fff'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 1,
                'line-color': '#A9A9A9',
                'target-arrow-color': '#A9A9A9',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(label)',
                'font-size': '6px',
                'color': '#A9A9A9'
              }
            }
          ],
          layout: {
            name: 'cose',
            animate: true,
            animationDuration: 1000
          }
        });

        // Evento para manejar la selección de nodos
        cy.on('select', 'node', (event) => {
          const node = event.target;
          const properties = node.data();
          this.showNodeProperties(properties);
        });
      } else {
        console.error("El contenedor de gráfico no se encontró");
      }
    });
  }

  // Método para mostrar propiedades de nodo en el contenedor
  showNodeProperties(properties: any) {
    const propertiesContent = document.getElementById('propertiesContent');
    if (propertiesContent) {
      propertiesContent.innerText = JSON.stringify(properties, null, 2);
    }
  }

  loadNodes() {
    this.neo4jService.getNodes(this.selectedType).subscribe((data: any) => {
      this.nodes = data;
      this.filteredNodes = this.nodes;
    });
  }

  filterNodes() {
    this.filteredNodes = this.nodes.filter(node =>
      JSON.stringify(node).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log("Filtered Nodes:", this.filteredNodes);
  }

  selectNode(node: any) {
    this.selectedNode = node;
    this.creatingNode = false;
  }

  onSubmit() {
    if (this.creatingNode) {
      this.neo4jService.createNode(this.selectedType, this.newProperties).subscribe(() => this.loadNodes());
    } else if (this.selectedNode) {
      this.neo4jService.updateNode(this.selectedType, this.selectedNode.id, this.selectedNode.properties).subscribe(() => this.loadNodes());
    }
  }

  // deleteNode() {
  //   if (this.selectedNode && !this.selectedNode.hasRelationships) {
  //     this.neo4jService.deleteNode(this.selectedType, this.selectedNode.id).subscribe(() => this.loadNodes());
  //   }
  // }

  getPropertiesKeys() {
    return Object.keys(this.selectedNode || this.newProperties);
  }

  getModelProperty(key: string): any {
    return this.creatingNode ? this.newProperties[key] : this.selectedNode.properties[key];
  }
  
  setModelProperty(key: string, value: any): void {
    if (this.creatingNode) {
      this.newProperties[key] = value;
    } else {
      this.selectedNode.properties[key] = value;
    }
  }

  createNode() {
    this.router.navigate(['/createNode']);
  }

  readNode() {
    this.router.navigate(['/readNode']);
  }

  updateNode() {
    this.router.navigate(['/updateNode']);
  }

  deleteNode() {
    this.router.navigate(['/deleteNode']);
  }

  goToConsultas() {
    this.router.navigate(['/consultas']);
  }

}
