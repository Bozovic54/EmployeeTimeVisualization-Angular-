import { Component,  AfterViewInit, Input } from '@angular/core';
import { Chart, registerables, TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables)

@Component({
  selector: 'app-employee-pie-chart',
  templateUrl: './employee-pie-chart.component.html',
  styleUrl: './employee-pie-chart.component.css'
})
export class EmployeePieChartComponent implements  AfterViewInit {
  @Input() employees: any[] = [];
  totalWorkedHours: number = 0;
  chart: any;

  ngAfterViewInit() {
    // Pozivanje metode za kreiranje grafikona u AfterViewInit kako bi se osiguralo da je DOM potpuno učitan
    if (this.employees && this.employees.length > 0) {
      this.createPieChart();
    } else {
      console.error('No employee data available to create the chart.');
    }
  }

  createPieChart(): void{
    console.log('Employee data:', this.employees); 
    this.totalWorkedHours = this.employees.reduce((total, employee) => total + employee.TotalWorkedHours, 0);

    const employeeNames = this.employees.map(e => e.EmployeeName);
    const employeeHours = this.employees.map(e => e.TotalWorkedHours);

    const ctx = document.getElementById('PieChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    if (this.chart) {
      this.chart.destroy(); // Uništava stari grafikon ako već postoji
    }
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: employeeNames, // Imena zaposlenih
        datasets: [{
          data: employeeHours, // Vreme rada zaposlenih
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ],
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem: TooltipItem<'pie'>) => { // Koristi strelicu za zadržavanje this
                const employeeName = tooltipItem.label;
                const workedHours = tooltipItem.raw as number; // Kastuj na number
                const percentage = ((workedHours / this.totalWorkedHours) * 100).toFixed(2);
                return `${employeeName}: ${workedHours} hours (${percentage}%)`;
              }
            }
          },
          datalabels: {
            formatter: (value: number, context: any) => {
              const percentage = ((value / this.totalWorkedHours) * 100).toFixed(2);
              return `${percentage}%`;
            },
            color: '#fff'
          }
        }
      }
    })
    
  }
}
