import { Component } from '@angular/core';
import { Neo4jService } from '../neo4j.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-load-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './load-csv.component.html',
  styleUrls: ['./load-csv.component.css']
})
export class LoadCsvComponent {
  
  constructor(private neo4jService: Neo4jService, private router: Router) {}

  ngOnInit() {
    console.log("LoadCsvComponent is loaded");
  }

  loadCsvData() {
    this.neo4jService.loadCsv().subscribe(
      response => {
        console.log('CSV data loaded successfully:', response);
        // Navega a la página CRUD después de cargar el CSV
        this.router.navigate(['/crud']);
      },
      error => {
        console.error('Error loading CSV data:', error);
      }
    );
  }

}
