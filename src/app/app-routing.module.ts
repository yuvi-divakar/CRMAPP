import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AccountCRUDComponent } from './dashboard/account-crud/account-crud.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ModulesComponent } from './dashboard/modules/modules.component';
import { AddComponent } from './dashboard/add/add.component';
import { DeleteComponent } from './dashboard/delete/delete.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', 
    component: DashboardComponent, canActivate: [AuthGuard],
    children: [
       {
        path: 'accountcrud',
        component: AccountCRUDComponent, canActivate: [AuthGuard]
      }/*,
      {
        path: 'add',
        component: AddComponent, canActivate: [AuthGuard]
      },
      {
        path: 'delete',
        component: DeleteComponent, canActivate: [AuthGuard]
      }*/
      ,
      {
        path: 'module/:id',
        component: ModulesComponent, canActivate: [AuthGuard]
      }]
  },
  { path: 'register', 
  component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
