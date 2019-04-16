import {Component} from '@angular/core';
import {InviteTeamMatesModel} from './invite-team-mates.model';
import {Router} from '@angular/router';
import {SurveyServiceService} from '../services/survey-service.service';

@Component({
  selector: 'app-invite-team-mates',
  templateUrl: './invite-team-mates.page.html',
  styleUrls: ['./invite-team-mates.page.scss'],
})
export class InviteTeamMatesPage {

  aryMembers: InviteTeamMatesModel[];
  isAnonymously = false;

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

  onClickBtnInvite() {
    // get the team we are inviting them to
    // for each invite save a team invite object 
    this.aryMembers.forEach(member =>{
      this.surveyService.createEmailInvite("Liam",member.email,"macys","Macys Cynhtia","E4ZWxJbFoDE29ywISRQY")
    })
    this.router.navigateByUrl('app/categories');
  }
  

}
