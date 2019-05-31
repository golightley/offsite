import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, NavigationExtras} from '@angular/router';
import {MenuController} from '@ionic/angular';
import {Firebase} from '@ionic-native/firebase/ngx';
import { SurveyServiceService } from '../../../services/survey-service.service';
import * as firebase from 'firebase/app';
import { LoadingService } from '../../../services/loading-service';

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
  respondErrorMsg = '';
  isCreate: boolean;
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    private firebaseCordova: Firebase,
    public loadingService: LoadingService,
    public surveyService: SurveyServiceService,
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

  async doLogin() {
    const result = await this.loadingService.doFirebase(async () => {
      const resp = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
      return resp;
    });
    if ( result && result.user) {
      console.log('[Login] userID = ' + result.user.uid);
      this.updateUsers(firebase.auth().currentUser);

      const teamID = await this.surveyService.getActiveTeam(result.user.uid);
      console.log('[CreateTeam] teamID = ' + teamID);
      if (teamID !== undefined) {
        this.router.navigate(['/team/invite-team-mates', {fromMenu: 'true'}]);
        //this.router.navigate(['/team/invite-team-mates'], navigationExtras);
      } else {
        //this.router.navigate(['/team/create-team'], navigationExtras);
        this.router.navigate(['/team/create-team', {fromMenu: 'false'}]);
      }
    } else {
      console.log(result.error);
      if ( result.error.message ) {
        this.respondErrorMsg = result.error.message;
      }
    }
  }

  onEmailFocus() {
    this.respondErrorMsg = '';
  }
  onPasswordFocus() {
    this.respondErrorMsg = '';
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

  updateToken(token: string, uid: string): void {

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
