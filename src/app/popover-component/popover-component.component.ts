import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import {SurveyServiceService} from '../services/survey-service.service';

@Component({
  selector: 'app-popover-component',
  templateUrl: './popover-component.component.html',
  styleUrls: ['./popover-component.component.scss']
})
export class PopoverComponentComponent implements OnInit {

  ideaId = null;
  constructor(
    private navParams:NavParams, 
    private popoverController:PopoverController,
    public surveyService: SurveyServiceService,
    ) { }

  ngOnInit() {
    this.ideaId = this.navParams.get('idea'); 
    console.log("Idea id"+this.ideaId);
    console.log(this.navParams)
  }
  report(){
    console.log("Report idea");
    this.surveyService.reportIdea(this.ideaId);
    this.closePopover()
  }


  closePopover(){
    this.popoverController.dismiss();
  }

}
