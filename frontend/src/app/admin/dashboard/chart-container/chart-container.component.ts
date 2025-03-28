import {Component, Input, AfterViewInit, ElementRef} from "@angular/core"
import {Chart, ChartType} from "chart.js"

@Component({
  selector: 'ums-chart-container',
  standalone: false,
  templateUrl: './chart-container.component.html',
  styleUrl: './chart-container.component.scss'
})
export class ChartContainerComponent implements AfterViewInit {
  @Input() title = ""
  @Input() chartId = ""
  @Input() chartType: ChartType = "line"
  @Input() chartData: any

  chart: Chart | null = null

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.createChart()
  }

  createChart(): void {
    const canvas = this.elementRef.nativeElement.querySelector(`#${this.chartId}`)
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let options: any = {}

    // Configure options based on chart type
    if (this.chartType === "line") {
      options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            border: {
              display: false,
            },
            ticks: {
              color: "rgba(0, 0, 0, 0.6)",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "rgba(0, 0, 0, 0.6)",
            },
          },
        },
      }
    } else if (this.chartType === "bar") {
      options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            border: {
              display: false,
            },
            ticks: {
              color: "rgba(0, 0, 0, 0.6)",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "rgba(0, 0, 0, 0.6)",
            },
          },
        },
      }
    } else if (this.chartType === "doughnut") {
      options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 20,
              boxWidth: 10,
              color: "rgba(0, 0, 0, 0.6)",
            },
          },
        },
        cutout: "70%",
      }
    }

    // Create chart
    this.chart = new Chart(ctx, {
      type: this.chartType,
      data: this.chartData,
      options: options,
    })
  }
}


