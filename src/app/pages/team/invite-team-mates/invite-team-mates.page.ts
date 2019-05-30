import { Component } from '@angular/core';
import { InviteTeamMatesModel } from './invite-team-mates.model';
import { Router, NavigationExtras } from '@angular/router';
import { SurveyServiceService } from '../../../services/survey-service.service';
import * as firebase from 'firebase/app';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
require('firebase/auth');
@Component({
  selector: 'app-invite-team-mates',
  templateUrl: './invite-team-mates.page.html',
  styleUrls: ['./invite-team-mates.page.scss'],
})
export class InviteTeamMatesPage {

  aryMembers: InviteTeamMatesModel[];
  isAnonymously = false;
  teamName: string;
  teamData: any;
  stage: string = 'team';
  createTeam: string = '';
  teamId: string;
  teamCode: string;
  invitedToTeamName: string;
  invitedToTeamId: string;
  hasBeenAlreadyInvitedToATeam: boolean = false;
  fromLoginScreen: string = 'false';
  userId: string = '';

  constructor(
    private router: Router,
    public surveyService: SurveyServiceService,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    const that = this;
    this.aryMembers = [
      new InviteTeamMatesModel()
    ];
    firebase.auth().onAuthStateChanged(user => {
      this.userId = user.uid;
    });
  }

  async ionViewWillEnter() {
    const that = this;
    await this.route.queryParams.subscribe(params => {
      if (params) {
        // get data if team was invited and passed from the sign up page
        this.invitedToTeamName = params.teamName;
        this.invitedToTeamId = params.teamId;
        this.fromLoginScreen = params.fromLoginScreen;
        console.log('invite-team-mates.teamname:' + this.invitedToTeamName + ',' + this.invitedToTeamId + ',' + this.fromLoginScreen);

        // stage determins to show a create a new team or already invited to a team
        if (this.invitedToTeamName !== null
          && this.invitedToTeamName !== undefined
          && this.invitedToTeamId != null
          && this.invitedToTeamId !== undefined) {
          //this.stage = 'alreadyInvited';
          that.router.navigate(['/team/invited-team-list']);
        } else if (this.fromLoginScreen === 'true') {
          this.stage = 'invite';
        } else {
          this.stage = 'team';
        }
      }
    });

  }

  async joinTeamWithName() { // join team does not work.
    // get the team we are inviting them to
    const that = this;
    console.log('[JoinTeam at signup] teamName = ' + that.createTeam);
    console.log('[JoinTeam at signup] userId = ' + that.userId);
    const data = await this.surveyService.joinTeamWithName(that.userId, that.createTeam);
    console.log('[JoinTeam] error = ' + data.error);
    if ( data && data.error === undefined && data.error !== 'Not found') {
      that.surveyService.showToastMsg('You have joined the team successfully');
      const navigationExtras: NavigationExtras = {
        replaceUrl: true,
        queryParams: {
          fromLoginScreen: 'true'
        }
      };
      that.router.navigate(['/app/notifications'], navigationExtras);
    } else if (data.error === 'Not found') {
      that.surveyService.showToastMsg('Team not exist');
    } else if (data.error === 'already exist') {
      that.surveyService.showToastMsg('The user has already joined the team.');
    } else {
      that.surveyService.showToastMsg(data.error);
    }
  }

  onClickBtnAddMember() {
    this.aryMembers.push(new InviteTeamMatesModel());
    this.joinTeamWithName();
  }

  onClickBtnRemoveMember(index) {
    this.aryMembers.splice(index, 1);
  }

  joinTeam() {
    console.log('Join team clicked');
    this.stage = 'join';
  }

  alreadyJoinedATeam() {
    this.joinTeamWithCode(this.invitedToTeamId);
    this.stage = 'invite';
  }


  async onClickBtnInvite() {
    console.log('Team id-->' + this.teamId);
    await this.surveyService.inviteTeamMembers(this.aryMembers, this.teamId, this.createTeam);
    console.log(' **** Sent all invite email **** ');
    this.router.navigateByUrl('app/notifications');
  }

  skipInvites() {
    this.router.navigateByUrl('app/notifications');
  }

  // async showToastMsg(message) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     closeButtonText: 'close',
  //     showCloseButton: true,
  //     duration: 2000
  //   });
  //   toast.present();
  // }

  async onClickCreateTeam() {
    const that = this;
    if ( this.createTeam === '') {
      const toast = await this.toastController.create({
        message: 'Please input your team name.',
        closeButtonText: 'close',
        showCloseButton: true,
        duration: 2000
      });
      toast.present();
      return;
    }
    // get the team we are inviting them to
    const data = await this.surveyService.createTeamByUserId(this.userId, this.createTeam);
    // if ( data && data.error === undefined) {
    //     console.log('Team created...');
    //     this.teamId = data;
    //     this.stage = 'invite';
    // } else {
    //   console.log(data.error);
    // }

    console.log('[CreateTeam] result = ' + data.error);
    if ( data && data.error === undefined && data.error !== 'exist') {
        console.log('Team created...');
        that.surveyService.showToastMsg('The team has been created successfully!');
        const navigationExtras: NavigationExtras = {
          replaceUrl: true,
          queryParams: {
            fromLoginScreen: 'true'
          }
        };
        this.router.navigate(['/app/notifications'], navigationExtras);
    } else if (data.error === 'exist') {
      console.log('Team already exist!');
      that.surveyService.showToastMsg('The team already exist!');
    } else {
      console.log(data.error);
      that.surveyService.showToastMsg('Failed to create the team.');
    }
  }

  joinTeamWithCode(teamId) { // join team does not work.
    let myTeamId = '';
    if (teamId == null) {
      myTeamId = this.teamCode;
    } else {
      myTeamId = teamId;
    }
    // get the team we are inviting them to
    this.surveyService.joinTeamWithCode(firebase.auth().currentUser.uid, myTeamId).then(joinedTeamData => {
      this.teamId = teamId;
        this.teamName = this.invitedToTeamName;
        this.createTeam = this.invitedToTeamName;
        this.stage = 'invite';
        myTeamId = myTeamId;
    });
  }
}

