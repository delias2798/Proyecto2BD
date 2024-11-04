import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadCsvComponent } from './load-csv/load-csv.component';
import { CrudComponent } from './crud/crud.component';
import { CreateNodeComponent } from './create-node/create-node.component';
import { ReadNodeComponent } from './read-node/read-node.component';
import { UpdateNodeComponent } from './update-node/update-node.component';
import { DeleteNodeComponent } from './delete-node/delete-node.component';
import { ConsultasComponent } from './consultas/consultas.component';

export const routes: Routes = [
  { path: '', component: LoadCsvComponent }, // Página de carga de CSV
  { path: 'crud', component: CrudComponent }, // Página CRUD
  { path: 'createNode', component: CreateNodeComponent }, // Página CRUD
  { path: 'readNode', component: ReadNodeComponent }, // Página CRUD
  { path: 'updateNode', component: UpdateNodeComponent }, // Página CRUD
  { path: 'deleteNode', component: DeleteNodeComponent }, // Página CRUDconsultas
  { path: 'consultas', component: ConsultasComponent }, // Página CRUD
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
