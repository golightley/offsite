import {Component} from '@angular/core';
import {InviteTeamMatesModel} from './invite-team-mates.model';
import {Router} from '@angular/router';
import {SurveyServiceService} from '../services/survey-service.service';
import * as firebase from 'firebase/app';
import {ActivatedRoute} from '@angular/router';

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
  invitedToTeamName:string;
  invitedToTeamId:string;
  hasBeenAlreadyInvitedToATeam:boolean = false;



  constructor(
    private router: Router,
    public surveyService: SurveyServiceService,
    private route: ActivatedRoute,

  ) {
    this.aryMembers = [
      new InviteTeamMatesModel()
    ];

    // get data if team was invited
    this.invitedToTeamName = this.route.snapshot.paramMap.get('teamName');
    this.invitedToTeamId = this.route.snapshot.paramMap.get('teamId');
    if(this.invitedToTeamName != null && this.invitedToTeamId !=null ){
      this.stage = 'alreadyInvited';
    }

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

  alreadyJoinedATeam(){
    this.joinTeamWithCode(this.invitedToTeamId);
    this.stage  = 'invite';

  }


  onClickBtnInvite() {
    
    console.log("Team id-->"+this.teamId )



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
             // make sure they haven't already been invited
        this.surveyService.checkIfInvitedtoAteamWithEmail(member.email).then(teamData => {
          console.log("invite is already outstanding...")
        }, function(error) {
        // The Promise was rejected.
        console.error(error);
        this.surveyService.createEmailInvite("Liam",member.email,this.createTeam,this.createTeam,this.teamId);
        });
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

  joinTeamWithCode(teamId) {
    var myTeamId = ""
    if(teamId==null){
      myTeamId = this.teamCode;
    }else{
      myTeamId = teamId
    }
    // get the team we are inviting them to
    this.surveyService.joinTeamWithCode(firebase.auth().currentUser.uid,myTeamId).then(joinedTeamData => {
      this.surveyService.getTeamByUserId(firebase.auth().currentUser.uid).then(joinedTeamData => {
        this.teamId     = joinedTeamData.id;
        this.teamName   = this.invitedToTeamName
        this.createTeam = joinedTeamData.data().teamName;
        this.stage      = 'invite';
        myTeamId        = myTeamId;

      })
    })
  }


  
  

}
