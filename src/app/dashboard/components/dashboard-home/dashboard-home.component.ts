import { BaseComponent } from './../../../shared/components/base.component';
import { AuthService } from './../../../core/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent extends BaseComponent<any> {

  constructor(
    authService: AuthService,
    dialog: MatDialog
  ) {
    super(authService, dialog);
  }

  onLogout(sidenav: MatSidenav): void {
    sidenav.close();
    this.logout();
  }

}
