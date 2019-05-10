import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, MenuController } from '@ionic/angular';
import {SurveyServiceService} from '../services/survey-service.service';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { PasswordValidator } from '../validators/password.validator';
import * as firebase from 'firebase/app';
require('firebase/auth')


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

  //vars
  name:string = "";
  email:string = "";
  password:string = "";


  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
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
    public surveyService: SurveyServiceService

  ) {
    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.signupForm = new FormGroup({
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

  doSignup() {
    console.log('do sign up');
    var hasBeenInvited = false;
    this.surveyService.email = this.email;

    // first make sure email isn't in invite list...
    this.surveyService.checkIfInvitedtoAteamWithEmail(this.email).then(teamData => {
      console.log("Team created...");
      console.log(teamData)
      hasBeenInvited = true;
      
    // if the email is not in the invite list...
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(data => {
        const newUser = data.user;
  
        newUser.updateProfile({
          // displayName: this.name,
        }).then(() => {
          // newUser.displayName = this.name;
          this.updateUsers(newUser)
            .then(() => {
              if(teamData != "null"){
                this.router.navigate(['/invite-team-mates', { 
                  teamName: teamData.data().team,
                  teamId:teamData.data().teamId
                 }]);
              }else{
                this.router.navigate(['/invite-team-mates']);        
              }

              // this.router.navigate(['/invite-team-mates'],);
            }, err => console.error(err));
        }, err => console.log(err));
      }, err => console.log(err));
  }, function(error) {
    // The Promise was rejected.
    
    console.error(error);
  });
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

  // doFacebookSignup(): void {
  //   console.log('facebook signup');
  //   this.router.navigate(['app/categories']);
  // }

  // doGoogleSignup(): void {
  //   console.log('google signup');
  //   this.router.navigate(['app/categories']);
  // }

  // doTwitterSignup(): void {
  //   console.log('twitter signup');
  //   this.router.navigate(['app/categories']);
  // }
}
