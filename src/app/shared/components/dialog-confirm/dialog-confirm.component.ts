import { DialogConfirmData } from './dialog-confirm-data.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialog-confirm',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false" cdkFocusInitial>Não</button>
      <button mat-button [mat-dialog-close]="true">Sim</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class DialogConfirmComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
    private dialogRef: MatDialogRef<DialogConfirmComponent>
  ) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = (this.data.disableClose !== undefined) ? this.data.disableClose : true;
  }
}
