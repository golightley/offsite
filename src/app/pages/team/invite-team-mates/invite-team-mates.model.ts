export enum TeamMemberRole {
  admin = 'admin',
  member = 'member'
}

export class InviteTeamMatesModel {
  email: string;
  role: TeamMemberRole;

  constructor() {
  }
}
