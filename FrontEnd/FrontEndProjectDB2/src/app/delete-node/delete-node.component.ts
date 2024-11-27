import { Component } from '@angular/core';
import { Neo4jService } from '../neo4j.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-delete-node',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-node.component.html',
  styleUrl: './delete-node.component.css'
})
export class DeleteNodeComponent {
  nodeId: string = ''; // Node ID input from the form
  nodeType: string = ''; // Node type (e.g., Proyecto, Tecnologia, etc.)
  confirmationMessage: string = '';
  errorMessage: string = '';

  constructor(private neo4jService: Neo4jService) {}

  deleteNode() {
    if (this.nodeId && this.nodeType) {
      this.neo4jService.deleteNode(this.nodeType, this.nodeId).subscribe(
        (response) => {
          this.confirmationMessage = `Node with ID ${this.nodeId} has been deleted successfully.`;
          this.errorMessage = '';
          this.nodeId = ''; // Clear the input field
          this.nodeType = ''; // Clear the node type
        },
        (error) => {
          console.error('Error deleting node:', error);
          this.errorMessage = `Error deleting node with ID ${this.nodeId}. Please check if it exists or if it has relationships.`;
          this.confirmationMessage = '';
        }
      );
    } else {
      this.errorMessage = 'Please enter both the Node ID and Node Type.';
    }
  }

}
