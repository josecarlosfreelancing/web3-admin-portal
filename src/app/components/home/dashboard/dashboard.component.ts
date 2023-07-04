import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../../../services/dashboard.service";
import {ToastrService} from "ngx-toastr";

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Label, MultiDataSet} from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public doughnutChartLabels: Label[] = ['Enabled', 'Disabled'];
  public data: ChartDataSets[] = [];
  public doughnutChartType: ChartType = 'doughnut';
  public showGarph1 = false;

  public totalUsers: number = 0;
  public totalUsersEnabled: number = 0;
  public totalUsersDisabled: number = 0;

  constructor(private dashboardService: DashboardService,
    private toastr: ToastrService) { }

  async ngOnInit() {
    await this.getTotalUsers();
    await this.getTotalUsersEnabled();
    await this.getTotalUsersDisabled();
    //Una vez terminadas las solicitudes, se genera la info de la gráfica
    this.data.push({
      data: [this.totalUsersEnabled, this.totalUsersDisabled],
      backgroundColor: ["#28a745", "#dc3545"]
    })
    this.showGarph1 = true;
  }

  async getTotalUsers() {
    await this.dashboardService.getTotalUsers().then(data => {
      this.totalUsers = data.totalUsers;
    }).catch(() => {
      this.toastr.error("Error getting total users");
    });
  }

  async getTotalUsersEnabled() {
    await this.dashboardService.getTotalUsersEnabled().then(data => {
      this.totalUsersEnabled = data.totalUsersEnabled;
    }).catch(() => {
      this.toastr.error("Error getting total users enabled");
    });
  }

  async getTotalUsersDisabled() {
    await this.dashboardService.getTotalUsersDisabled().then(data => {
      this.totalUsersDisabled = data.totalUsersDisabled;
    }).catch(() => {
      this.toastr.error("Error getting total users disabled");
    });
  }

}
