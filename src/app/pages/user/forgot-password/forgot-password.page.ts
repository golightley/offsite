import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { LoadingService } from '../../../services/loading-service';
import * as firebase from 'firebase/app';

require('firebase/auth');
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: [
    './styles/forgot-password.page.scss'
  ]
})

export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;

  respondErrorMsg: string;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    public loadingService: LoadingService
  ) {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  onEmailFocus() {
    this.respondErrorMsg = '';
  }

  async resetPassword() {
    const email = this.forgotPasswordForm.value.email;
    console.log(email);
    const result = await this.loadingService.doFirebase(async() => {
      await firebase.auth().sendPasswordResetEmail(email);
      return 'success';
    });
    console.log(result);
    if (result === 'success') {
      this.router.navigate(['auth/forgot-email-confirm']);
    } else {
      console.log(result.errorMessage);
      if (result.error.message) {
        this.respondErrorMsg = result.error.message;
      }
    }
  }
}
