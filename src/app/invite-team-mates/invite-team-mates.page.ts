import { Component } from '@angular/core';
import { InviteTeamMatesModel } from './invite-team-mates.model';
import { Router } from '@angular/router';
import { SurveyServiceService } from '../services/survey-service.service';
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


  constructor(
    private router: Router,
    public surveyService: SurveyServiceService,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    this.aryMembers = [
      new InviteTeamMatesModel()
    ];
  }

  async ionViewWillEnter() {

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
          this.stage = 'alreadyInvited';
        } else if (this.fromLoginScreen === 'true') {
          this.stage = 'invite';
        } else {
          this.stage = 'team';
        }
      }
    });

  }

  onClickBtnAddMember() {
    this.aryMembers.push(new InviteTeamMatesModel());
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

  async onClickCreateTeam() {
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
    const data = await this.surveyService.createTeamByUserId(firebase.auth().currentUser.uid, this.createTeam);
    if ( data && data.error === undefined) {
        console.log('Team created...');
        this.teamId = data;
        this.stage = 'invite';
    } else {
      console.log(data.error);
    }
  }

  joinTeamWithCode(teamId) {
    let myTeamId = '';
    if (teamId == null) {
      myTeamId = this.teamCode;
    } else {
      myTeamId = teamId;
    }
    // get the team we are inviting them to
    this.surveyService.joinTeamWithCode(firebase.auth().currentUser.uid, myTeamId).then(joinedTeamData => {
      this.surveyService.getTeamByUserId(firebase.auth().currentUser.uid).then(joinedTeamData => {
        this.teamId = joinedTeamData.id;
        this.teamName = this.invitedToTeamName;
        this.createTeam = joinedTeamData.data().teamName;
        this.stage = 'invite';
        myTeamId = myTeamId;

      });
    });
  }
}