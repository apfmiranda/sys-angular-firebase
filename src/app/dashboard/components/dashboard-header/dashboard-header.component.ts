import { BaseComponent } from './../../../shared/components/base.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../../core/service/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent extends BaseComponent<any> {

  @Input() sidenav: MatSidenav;

  constructor(
    authService: AuthService,
    dialog: MatDialog,
    public title: Title
  ) {
    super(authService, dialog);
  }

}
