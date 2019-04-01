import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invite-team-mates',
  templateUrl: './invite-team-mates.page.html',
  styleUrls: ['./invite-team-mates.page.scss'],
})
export class InviteTeamMatesPage implements OnInit {
 
  public invite_members: any;
  public selected_role: any;
  public count: number = 1;
  public isAnonymously: boolean; 
  public userId: any;
  public roles = [
    { id: 0, value: 'admin'},
    { id: 1, value: 'member'}
  ];

  constructor(
    // private router: Router,
    // public teamService: TeamDataService,
    // public alertController: AlertController,
    // private storage : Storage,
  ) {  
       this.invite_members = [{
        invitedEmail: '',
        invitedName : '',
        role: ''
    }];
}

  ngOnInit() {
  }

  selectRole(role, i){
    this.selected_role = role;
    this.invite_members[i].role = role;
  }


  addMember(){
    this.invite_members.push({
      invitedEmail: '',
      invitedName : '',
      role: ''
    });

    this.count = this.invite_members.length;
  }

}
