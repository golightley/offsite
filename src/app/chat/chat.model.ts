
export class ChatModel {
  from       ?: string;
  text       ?: string;
  lastMessage?: ChatModel | any;
  isEdited   ?: boolean;
  createdAt  ?: string | any;
  updatedAt  ?: string | any;
  ideaId  ?: string;
  teamId  ?: string;
  status  ?: string;   // 'pending' | 'sent'

  constructor(data: any) {
   this.from = data['from'];
   this.text = data['text'];
   this.isEdited = data['isEdited'];
   this.createdAt = data['createdAt'];
   this.ideaId = data['ideaId'];
   this.teamId = data['teamId'];
  }
}


