import {Component} from '@angular/core';
import {InviteTeamMatesModel} from './invite-team-mates.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-invite-team-mates',
  templateUrl: './invite-team-mates.page.html',
  styleUrls: ['./invite-team-mates.page.scss'],
})
export class InviteTeamMatesPage {

  aryMembers: InviteTeamMatesModel[];
  isAnonymously = false;

  constructor(
    private router: Router
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
    this.router.navigateByUrl('app/categories');
  }

}
