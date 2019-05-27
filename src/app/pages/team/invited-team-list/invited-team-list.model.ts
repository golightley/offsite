export class InvitedTeamModel {
    id          ?: string = '';
    active      ?: boolean = true;
    email       ?: string = '';
    teamName    ?: string = '';
    teamId      ?: string = '';
    user        ?: string = '';
  
    constructor(data: any) {
     this.active = data['active'];
     this.email = data['email'];
     this.teamName = data['teamName'];
     this.teamId = data['teamId'];
     this.user = data['user'];
    }
  }