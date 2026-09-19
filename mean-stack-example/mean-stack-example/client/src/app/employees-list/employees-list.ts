import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employees-list.html',
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm: string = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Failed to load employees:', error);
      }
    });
  }

  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.fetchEmployees();
      },
      error: (error) => {
        console.error('Failed to delete employee:', error);
      }
    });
  }

  get filteredEmployees(): Employee[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.employees;
    }
    return this.employees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(term) ||
        emp.position?.toLowerCase().includes(term) ||
        emp.level?.toLowerCase().includes(term)
    );
  }
}
