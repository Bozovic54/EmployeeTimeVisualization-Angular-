import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../models/employee.model'; 

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit {

  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(data => {
      const groupedEmployees = this.groupEmployeesByName(data);
  
      this.employees = Object.keys(groupedEmployees)
        .filter(employeeName => employeeName && employeeName.trim().length > 0 && employeeName.trim().toLowerCase() !== 'null') // Filtriraj prazna i null imena
        .map(employeeName => {
          const totalHours = this.calculateTotalWorkedHours(groupedEmployees[employeeName]);
          return { 
            EmployeeName: employeeName, 
            TotalWorkedHours: totalHours 
          } as Employee;
        });
  
      this.employees.sort((a, b) => (b.TotalWorkedHours || 0) - (a.TotalWorkedHours || 0));
    });
  }

  private groupEmployeesByName(employees: Employee[]): { [key: string]: Employee[] } {
    return employees.reduce((acc, employee) => {
      if (!acc[employee.EmployeeName]) {
        acc[employee.EmployeeName] = [];
      }
      acc[employee.EmployeeName].push(employee);
      return acc;
    }, {} as { [key: string]: Employee[] });
  }

  private calculateTotalWorkedHours(employees: Employee[]): number {
    let totalHours = 0;
    employees.forEach(employee => {
      const startTime = new Date(employee.StarTimeUtc);
      const endTime = new Date(employee.EndTimeUtc);

      if( endTime.getTime() > startTime.getTime()){

        const hoursWorked = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        if (hoursWorked >= 0) {
          totalHours += hoursWorked;
        }
      }
      });
      return totalHours;
    }
  }


