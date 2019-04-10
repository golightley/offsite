import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MenuController} from '@ionic/angular';
import {Firebase} from '@ionic-native/firebase/ngx';

import * as firebase from 'firebase/app';

require('firebase/auth')

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './styles/login.page.scss'
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  email = '';
  password = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController
  ) {
    this.loginForm = new FormGroup({
      'email': new FormControl('test@test.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }

  ngOnInit() {
    this.menu.enable(false);
  }

  doLogin() {
    console.log('do Log In');
    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
    .then(user => {
      console.log(user);
      this.updateUsers(firebase.auth().currentUser)
        .then(() => {
          // this.router.navigate(['app/notifications']);
          this.router.navigate(['/invite-team-mates']);
        }, err => console.error(err));
    }, err => console.log(err));
  }

  private updateUsers(user: firebase.User) {
    const params = {
      name: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      loggedAt: Date.now()
    };
    return firebase.firestore().collection('users').doc(user.uid).set(params);
  }


  goToForgotPassword(): void {
    console.log('redirect to forgot-password page');
  }

  doFacebookLogin(): void {
    console.log('facebook login');
    this.router.navigate(['app/categories']);
  }

  doGoogleLogin(): void {
    console.log('google login');
    this.router.navigate(['app/categories']);
  }

  doTwitterLogin(): void {
    console.log('twitter login');
    this.router.navigate(['app/categories']);
  }
}
