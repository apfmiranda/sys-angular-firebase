import { User } from './../../core/models/user.model';
import { ErrorService } from './../../core/service/error.service';
import { AuthService } from './../../core/service/auth.service';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  configs = {
    isLogin: true,
    actionText: 'Login',
    buttonActionText: 'Criar uma conta',
    isLoading: false
  };

  private componentAlive = true;

  constructor(
    public authService: AuthService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public ngZone: NgZone
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email:    ['', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    const operation =
      (this.configs.isLogin)
        ? this.authService.signinUser(this.loginForm.value)
        : this.authService.signupUser(this.loginForm.value);

    operation
    .pipe(
      takeWhile(() => this.componentAlive)
    ).subscribe(
      res => {
        this.authService.setRememberMe(this.loginForm.value);
        const redirect = this.authService.redirectUrl || '/dashboard';

        this.authService.isAuthenticated
        .pipe(takeWhile(() => this.componentAlive))
        .subscribe((is: boolean) => {
          if (is) {
            this.authService.redirectUrl = null;
            this.configs.isLoading = false;
            this.router.navigate([redirect]);
          }
        });
      },
      error => {
        console.log('Erro onSubmit(): ', error);
        this.configs.isLoading = false;
        this.snackBar.open(this.errorService.getErrorMessage(error), 'ok', {duration: 5000, verticalPosition: 'top'});
      },
      () => { }
    );
  }

  loginWithGoogle() {
    this.actionSubmit(this.authService.GoogleAuth());
  }

  loginWithMicrosoft() {
    this.actionSubmit(this.authService.MicrosoftAuth());
  }

  actionSubmit(obs: Observable<any> ) {
    this.configs.isLoading = true;
    obs.pipe(
      takeWhile(() => this.componentAlive)
    ).subscribe(

      res => {
        this.ngZone.run(() => {
          const u = this.authService.afAuth.auth.currentUser;

          if (u != null) {
            u.getIdToken(false).then(r => {
              console.log('Token: ' + r);
            });

            u.providerData.forEach((profile) => {
              console.log('Sign-in provider: ' + profile.providerId);
              console.log('  Provider-specific UID: ' + profile.uid);
              console.log('  Name: ' + profile.displayName);
              console.log('  Email: ' + profile.email);
              console.log('  Photo URL: ' + profile.photoURL);
            });
          }

          this.authService.setRememberMe({email: res.email, password: ''});
          const redirect = this.authService.redirectUrl || '/dashboard';

          this.authService.isAuthenticated
          .pipe(takeWhile(() => this.componentAlive))
          .subscribe((is: boolean) => {
            if (is) {
              this.authService.redirectUrl = null;
              this.configs.isLoading = false;
              this.router.navigate([redirect]);
            }
          });
        });

      },
      error => {
        this.ngZone.run(() => {
          console.log('Erro onSubmit(): ', error);
          this.configs.isLoading = false;
          this.snackBar.open(this.errorService.getErrorMessage(error), 'ok', {duration: 5000, verticalPosition: 'top'});

        });
      },
      () => { }
    );
  }


  changeAction(): void {
    this.configs.isLogin = !this.configs.isLogin;
    this.configs.actionText = !this.configs.isLogin ? 'Cadastrar' : 'Login';
    this.configs.buttonActionText = !this.configs.isLogin ? 'Já tenho uma conta' : 'Criar uma conta';
  }

  get email(): FormControl { return  this.loginForm.get('email') as FormControl; }
  get password(): FormControl { return  this.loginForm.get('password') as FormControl; }

  onKeepSigned(): void {
    this.authService.toggleKeepSigned();
  }

  onRememberMe(): void {
    this.authService.toggleRememberMe();
  }

  ngOnDestroy(): void {
    this.componentAlive = false;
  }
}
