import {Component} from '@angular/core';
import {InviteTeamMatesModel} from './invite-team-mates.model';
import {Router} from '@angular/router';
import {SurveyServiceService} from '../services/survey-service.service';
import * as firebase from 'firebase/app';

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
  stage:string = "team";
  createTeam:string = "";
  teamId:string;
  teamCode:string;


  constructor(
    private router: Router,
    public surveyService: SurveyServiceService,

  ) {
    this.aryMembers = [
      new InviteTeamMatesModel()
    ];
  }

  onClickBtnAddMember() {
    this.aryMembers.push(new InviteTeamMatesModel());
  }

  onClickBtnRemoveMember(index) {
    this.aryMembers.splice(index, 1);
  }

  joinTeam(){
    console.log("Join team clicked")
    this.stage = "join";
  }

  onClickBtnInvite() {
    // get the team we are inviting them to
    if(this.teamId == ''){
      this.surveyService.getTeamByUserId(firebase.auth().currentUser.uid).then(teamData => {
        console.log("Team data has been loaded...");
        console.log(teamData)
        this.teamData = teamData;
        this.teamName = teamData.data().teamName;
  
       // for each invite save a team invite object 
      this.aryMembers.forEach(member =>{
        this.surveyService.createEmailInvite("Liam",member.email,this.teamName,this.teamName,this.teamData.id)
      })
  
      })
    }else{
        // for each invite save a team invite object 
       this.aryMembers.forEach(member =>{
         this.surveyService.createEmailInvite("Liam",member.email,this.createTeam,this.createTeam,this.teamId);
      })

    }


    this.router.navigateByUrl('app/categories');
  }

  onClickCreateTeam() {
    // get the team we are inviting them to
    this.surveyService.createTeamByUserId(firebase.auth().currentUser.uid,this.createTeam).then(teamData => {
      console.log("Team created...");
      console.log(teamData)
      this.teamId = teamData;
      this.stage  = 'invite';
    })
  }

  joinTeamWithCode() {
    // get the team we are inviting them to
    this.surveyService.joinTeamWithCode(firebase.auth().currentUser.uid,this.teamCode).then(teamData => {
      console.log("Team created...");
      console.log(teamData)
      this.teamId = teamData;
      this.stage  = 'invite';
    })
  }


  
  

}
