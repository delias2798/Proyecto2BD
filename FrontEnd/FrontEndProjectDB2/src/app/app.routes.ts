import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadCsvComponent } from './load-csv/load-csv.component';
import { CrudComponent } from './crud/crud.component';

export const routes: Routes = [
  { path: '', component: LoadCsvComponent }, // Página de carga de CSV
  { path: 'crud', component: CrudComponent }, // Página CRUD
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
