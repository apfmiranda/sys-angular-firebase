import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatLineModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    DialogConfirmComponent
  ],
  entryComponents: [
    DialogConfirmComponent
  ],
  imports: [
    FontAwesomeModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatToolbarModule,
  ],
  exports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule,
    MatLineModule,
    MatSidenavModule,
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule
  ]
})
export class SharedModule { }
