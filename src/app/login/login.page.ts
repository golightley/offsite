import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, NavigationExtras} from '@angular/router';
import {MenuController, LoadingController} from '@ionic/angular';
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

  loading: any;
  ldc: LoadingController;

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
    public menu: MenuController,
    private firebaseCordova:Firebase,
    loadingController: LoadingController
  ) {
    
    this.ldc = loadingController;
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

  async doLogin() {
    console.log('do Log In');
    await this.doFirebase(async () => {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(user => {
        console.log(user);
        this.updateUsers(firebase.auth().currentUser);
        // this.router.navigate(['app/notifications']);
          const navigationExtras: NavigationExtras = {
          replaceUrl: true,
          queryParams: {
            fromLoginScreen: 'true'
          }
        };
        this.router.navigate(['/invite-team-mates'], navigationExtras);
      }, err => console.log(err));
    });
  }

  protected async presentLoading() {
    this.loading = await this.ldc.create({
      message: 'Please wait...',
      mode: 'ios',
      // spinner: 'dots',
      // cssClass: 'loading'
    });
    return await this.loading.present();
  }

  protected async doFirebase(fn) {
    await this.presentLoading();
    try {
      return await fn();
    } catch (error) {
      console.log(error);
    } finally {
      await this.loading.dismiss();
    }
  }

  private updateUsers(user: firebase.User) {

    this.firebaseCordova.grantPermission();

     this.firebaseCordova.getToken().then((token) => {
      console.log('Printing token...');
      console.log(token);
      this.updateToken(token, firebase.auth().currentUser.uid);
    }).catch((error) => {
      console.log('Error fired');
      console.log(error);
    });
    
    // const params = {
    //   name: user.displayName,
    //   email: user.email,
    //   phoneNumber: user.phoneNumber,
    //   team:'E4ZWxJbFoDE29ywISRQY',
    //   loggedAt: Date.now()
    // };
    // return firebase.firestore().collection('users').doc(user.uid).set(params);
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

  updateToken(token:string, uid:string):void {

    firebase.firestore().collection('users').doc(uid).update({
      'token': token,
      'tokenUpdated': firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      console.log('token saved to cloud firestore');
    }).catch((error) => {
      console.log(error);
    });
  }
}
