
export class ChatModel {
  userId       ?: string;
  text       ?: string;
  lastMessage?: ChatModel | any;
  createdAt  ?: string | any;
  createdDateTime  ?: string | any;
  updatedAt  ?: string | any;
  ideaId  ?: string;
  teamId  ?: string;
  status  ?: string;   // 'pending' | 'sent'

  constructor(data: any) {
   this.userId = data['userId'];
   this.text = data['text'];
   this.createdAt = data['createdAt'];
   this.createdDateTime = data['createdDateTime'];
   this.ideaId = data['ideaId'];
   this.teamId = data['teamId'];
  }
}


