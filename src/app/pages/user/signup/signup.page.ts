import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { ModalController, MenuController } from '@ionic/angular';
import { SurveyServiceService } from '../../../services/survey-service.service';
import { TermsOfServicePage } from '../../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../../privacy-policy/privacy-policy.page';
import { PasswordValidator } from '../../../validators/password.validator';
import * as firebase from 'firebase/app';
import { LoadingService } from '../../../services/loading-service';
require('firebase/auth');


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    './styles/signup.page.scss'
  ]
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  matching_passwords_group: FormGroup;

  name = '';
  email = '';
  password = '';
  respondErrorMsg = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ]
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    public surveyService: SurveyServiceService,
    public loadingService: LoadingService

  ) {
    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.signupForm = new FormGroup({
      'name': new FormControl(''),
      'email': new FormControl('test@test.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'matching_passwords': this.matching_passwords_group
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServicePage
    });
    return await modal.present();
  }

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage
    });
    return await modal.present();
  }

  async doSignup() {
    this.surveyService.email = this.email;
    console.log('Name: ' + this.name);
    console.log('Email: ' + this.email);

    const result = await this.loadingService.doFirebase(async () => {
      // first make sure email isn't in invite list...
      const teamData = await this.surveyService.checkIfInvitedtoAteamWithEmail(this.email);
      console.log('get Team data...');
      console.log(teamData);
      // create a new user in fireabase
      const userData = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
      // create the first field in user table
      const params = {
        name: this.name,
        email: userData.user.email,
        readIdeaTime: new Date(new Date(2000, 1, 1, 0, 0, 0)),
        loggedAt: Date.now()
      };
      await firebase.firestore().collection('users').doc(userData.user.uid).set(params);
      // if they were invited to a team, then pass in the team data
      if (teamData !== null) {
        // this.router.navigate(['/team/invited-team-list'], navigationExtras);
        this.router.navigate(['/team/invited-team-list', {fromMenu: 'false'}]);
      } else {
        console.log('empty team');
        // this.router.navigate(['/team/create-team'], navigationExtras);
        this.router.navigate(['/team/create-team', {fromMenu: 'false'}]);
      }
      return 'registered';
    });

    if (result !== 'registered') {
      console.log(result.error);
      if ( result.error.message ) {
        this.respondErrorMsg = result.error.message;
      }
    }
  }

  onEmailFocus() {
    this.respondErrorMsg = '';
  }
}
