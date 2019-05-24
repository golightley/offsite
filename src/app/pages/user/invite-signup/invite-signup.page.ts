import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SurveyServiceService} from '../../../services/survey-service.service';


@Component({
  selector: 'app-invite-signup',
  templateUrl: './invite-signup.page.html',
  styleUrls: ['./invite-signup.page.scss'],
})
export class InviteSignupPage implements OnInit {
  id: string;
  teamName: string;

  constructor(
    private route: ActivatedRoute,  
    public surveyService: SurveyServiceService
    ){ }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log("This id..."+this.id);

    this.surveyService.getTeamById(this.id).then(teamData => {
      console.log("Team data has been loaded...");
      console.log(teamData)
      this.teamName = teamData.teamName;
    })

  }

}
