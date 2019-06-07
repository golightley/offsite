import { Component, OnInit } from '@angular/core';
import { SurveyServiceService } from '../../../services/survey-service.service';
import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';
import {Router, NavigationExtras, ActivatedRoute} from '@angular/router';

require('firebase/auth');

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.page.html',
  styleUrls: ['./create-team.page.scss'],
})
export class CreateTeamPage implements OnInit {
  createTeam = '';
  userId = '';
  isCancel = '';
  fromMenu: string;
  constructor(
    public surveyService: SurveyServiceService,
    private route: ActivatedRoute,
    public router: Router,
    private toastController: ToastController
  ) {

  }

  ngOnInit() {
    const that = this;
    firebase.auth().onAuthStateChanged(user => {
      that.userId = user.uid;
    });
  }
  async ionViewWillEnter() {
    const that = this;
    that.createTeam = '';
    this.fromMenu = this.route.snapshot.paramMap.get('fromMenu');
    console.log('[CreateTeam] fromMenu = ' + this.fromMenu);
    if (that.fromMenu === 'true') {
      that.isCancel = 'true';
    } else {
      that.isCancel = 'false';
    }
    // await this.route.queryParams.subscribe(params => {
    //   if (params) {
    //     // get data if team was invited and passed from the sign up page
    //     // const teamID = await this.surveyService.getActiveTeam(this.userId);
    //     if (that.hasTeam === 'true') {
    //       that.isCancel = 'true';
    //     } else {
    //       that.isCancel = 'false';
    //     }
    //   }
    // });
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
      this.surveyService.showToastMsg('Please input your team name.');
      return;
    }

    // get the team we are inviting them to
    const data = await this.surveyService.createTeamByUserId(this.userId, this.createTeam);
    if ( data && data.error === undefined && data.error !== 'exist') {
        console.log('Team created...');
        this.surveyService.showToastMsg('Successfully created!');
        const navigationExtras: NavigationExtras = {
          replaceUrl: true,
          queryParams: {
            fromLoginScreen: 'true'
          }
        };
        this.router.navigate(['/app/notifications'], navigationExtras);
    } else if (data.error === 'exist') {
      console.log('Team already exist!');
      this.surveyService.showToastMsg('This team already exist!');
    } else {
      console.log(data.error);
      this.surveyService.showToastMsg('Create team fail!');
    }
  }
}
