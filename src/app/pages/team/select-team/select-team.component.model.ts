export class UserTeamsModel {
    id          ?: string = '';
    teamName    ?: string = '';
    createdBy   ?: string = '';
    constructor(data: any) {
     this.teamName = data['teamName'];
     this.createdBy = data['createdBy'];
    }
  }

  export class UserModel {
    id          ?: string = '';
    teamId      ?: string = '';
    email       ?: string = '';
    name        ?: string = '';
  
    constructor(data: any) {
     this.teamId = data['teamId'];
     this.email = data['email'];
     this.name = data['name'];
    }
  }