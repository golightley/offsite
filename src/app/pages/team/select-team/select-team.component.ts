import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-select-team',
  templateUrl: './select-team.component.html',
  styleUrls: ['./select-team.component.scss']
})
export class SelectTeamComponent implements OnInit {

  constructor(
    private pc : PopoverController
  ) { }

  ngOnInit() {
  }

  selectTeam() {
    this.pc.dismiss();
  }
}
