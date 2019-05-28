import { Component, OnInit } from '@angular/core';
import { SurveyServiceService } from '../../../services/survey-service.service';
import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';
import {Router, NavigationExtras} from '@angular/router';

require('firebase/auth');

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.page.html',
  styleUrls: ['./create-team.page.scss'],
})
export class CreateTeamPage implements OnInit {
  createTeam: string = '';
  userId: string = '';

  constructor(
    public surveyService: SurveyServiceService,
    public router: Router,
    private toastController: ToastController
  ) 
  {

  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.userId = user.uid;
    });
  }

  async showToastMsg(message) {
    const toast = await this.toastController.create({
      message: message,
      closeButtonText: 'close',
      showCloseButton: true,
      duration: 2000
    });
    toast.present();
  }
  skipInvites() {
    const navigationExtras: NavigationExtras = {
      replaceUrl: true,
      queryParams: {
        fromLoginScreen: 'true'
      }
    };
    this.router.navigate(['/app/notifications'], navigationExtras);
  }

  async onClickCreateTeam() {
    
    if ( this.createTeam === '') {
      this.showToastMsg('Please input your team name.');
      return;
    }

    // get the team we are inviting them to
    const data = await this.surveyService.createTeamByUserId(this.userId, this.createTeam);
    if ( data && data.error === undefined && data.error != 'exist') {
        console.log('Team created...');
        this.showToastMsg('The team has been created successfully!');
        const navigationExtras: NavigationExtras = {
          replaceUrl: true,
          queryParams: {
            fromLoginScreen: 'true'
          }
        };
        this.router.navigate(['/app/notifications'], navigationExtras);
    } else if (data.error == 'exist') {
      console.log('Team already exist!');
      this.showToastMsg('The team already exist!');
    }
    else {
      console.log(data.error);
      this.showToastMsg('Failed to create the team.');
    }
  }
}
