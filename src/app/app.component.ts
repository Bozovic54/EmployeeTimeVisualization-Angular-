import { Component } from '@angular/core';
import { Employee } from './models/employee.model'; // Promeni putanju prema mestu gde se model nalazi


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularProject';
  employees: Employee[] = [];

  updateEmployees(employees: Employee[]): void {
    this.employees = employees;
  }
}
