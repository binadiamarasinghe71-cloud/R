import { Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list';
import { EmployeeFormComponent } from './employee-form/employee-form';

export const routes: Routes = [
  { path: '', component: EmployeesListComponent, title: 'Employees List' },
  { path: 'new', component: EmployeeFormComponent, title: 'Add Employee' },
  { path: 'edit/:id', component: EmployeeFormComponent, title: 'Edit Employee' },
];