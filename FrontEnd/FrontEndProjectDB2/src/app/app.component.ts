import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { provideHttpClient } from '@angular/common/http'; // Use provideHttpClient for HttpClient
import { CommonModule } from '@angular/common';
import { Neo4jService } from './neo4j.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule], // No need to import HttpClientModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontEndProjectDB2';
  name: string = '';
  age: number | undefined;
  createdNode: any;

  constructor(private neo4jService: Neo4jService) {}

  // onSubmit() {
  //   if (this.name && this.age) {
  //     this.neo4jService.createNode(this.name, this.age).subscribe(
  //       (response) => {
  //         console.log('Node created successfully:', response);
  //         this.createdNode = response;
  //       },
  //       (error) => {
  //         console.error('Error creating node:', error);
  //       }
  //     );
  //   }
  // }

  loadCsvData() {
    this.neo4jService.loadCsv().subscribe(
      response => {
        console.log('CSV data loaded successfully:', response);
      },
      error => {
        console.error('Error loading CSV data:', error);
      }
    );
  }
}
