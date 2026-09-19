import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-form.html',
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = { name: '', position: '', level: 'junior' };
  isEditMode = false;
  id: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEditMode = true;
      this.employeeService.getEmployee(this.id).subscribe({
        next: (emp) => {
          this.employee = emp;
        },
      });
    }
  }

  submitForm() {
    const payload: any = { ...this.employee };
    delete payload._id; // Strip _id so backend/MongoDB accepts update

    if (this.isEditMode && this.id) {
      this.employeeService.updateEmployee(this.id, payload).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Update failed:', error);
        }
      });
    } else {
      this.employeeService.createEmployee(payload).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Create failed:', error);
        }
      });
    }
  }
}