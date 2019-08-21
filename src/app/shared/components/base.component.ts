import { take } from 'rxjs/operators';
import { DialogConfirmData } from './dialog-confirm/dialog-confirm-data.interface';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { AuthService } from './../../core/service/auth.service';
import { MatDialog } from '@angular/material/dialog';

export class BaseComponent<T extends {id: number | string}> {

  constructor(
    protected authService?: AuthService,
    protected dialog?: MatDialog
  ) {}

  trackByFn(index: number, item: T): number | string {
    return item.id;
  }

  logout(): void {
    const dialogRef = this.dialog.open<DialogConfirmComponent, DialogConfirmData, boolean>(
      DialogConfirmComponent,
      { data: { title: 'Sair?', message: 'Você realmente quer sair?' } }
    );

    dialogRef.beforeClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.authService.logout();
        }
      });
  }

}
