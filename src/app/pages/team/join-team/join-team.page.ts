import { Component, OnInit } from '@angular/core';
import { SurveyServiceService } from '../../../services/survey-service.service';
import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';
import {Router, NavigationExtras} from '@angular/router';

require('firebase/auth');

@Component({
  selector: 'app-join-team',
  templateUrl: './join-team.page.html',
  styleUrls: ['./join-team.page.scss'],
})
export class JoinTeamPage implements OnInit {

  teamName: string = '';
  userId: string = '';

  constructor(
    public surveyService: SurveyServiceService,
    private toastController: ToastController,
    public router: Router
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

  async joinTeamWithName() { // join team does not work.
    // get the team we are inviting them to
    const data = await this.surveyService.joinTeamWithName(this.userId, this.teamName);
    console.log('[JoinTeam] error = ' + data.error);
    if ( data && data.error === undefined && data.error !== 'Not found') {
      this.surveyService.showToastMsg('You have joined the team successfully');
      const navigationExtras: NavigationExtras = {
        replaceUrl: true,
        queryParams: {
          fromLoginScreen: 'true'
        }
      };
      this.router.navigate(['/app/notifications'], navigationExtras);
    } else if (data.error === 'Not found') {
      this.showToastMsg('Team not exist');
    } else if (data.error === 'already exist') {
      this.showToastMsg('You have already joined this team.');
    } else {
      this.showToastMsg(data.error);
    }
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
}
