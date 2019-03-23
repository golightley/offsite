import { Component,OnInit, ViewEncapsulation,} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { counterRangeValidator } from '../../components/counter-input/counter-input.component';
import * as firebase from 'firebase/app';
import { SurveyServiceService } from '../../services/survey-service.service';
import { AlertController, NavController} from '@ionic/angular';

@Component({
  selector: 'forms-filters-page',
  templateUrl: './forms-filters.page.html',
  styleUrls: [
    './styles/forms-filters.page.scss'
  ]
})
export class FormsFiltersPage implements OnInit {
  rangeForm: any;
  checkboxForm: FormGroup;
  radioForm: FormGroup;
  checkboxTagsForm: FormGroup;
  radioTagsForm: FormGroup;
  switchersForm: FormGroup;
  counterForm: any;
  ratingForm: FormGroup;
  radioColorForm: FormGroup;
  questions: any = [];
  responses: any = {};



  constructor(
    public surveyService: SurveyServiceService,
    private navCtrl: NavController, 
    public alertController: AlertController,
    
    ) {
    
    this.rangeForm = new FormGroup({
      single: new FormControl(25),
      dual: new FormControl({lower: 12, upper: 23})
    });

    this.checkboxForm = new FormGroup({
      person_1: new FormControl(true),
      person_2: new FormControl(false),
      person_3: new FormControl(false),
      person_4: new FormControl(true),
      person_5: new FormControl(false)
    });

    this.radioForm = new FormGroup({
      selected_option: new FormControl('apple')
    });

    this.checkboxTagsForm = new FormGroup({
      tag_1: new FormControl(true),
      tag_2: new FormControl(false),
      tag_3: new FormControl(true),
      tag_4: new FormControl(true),
      tag_5: new FormControl(false),
      tag_6: new FormControl(false),
      tag_7: new FormControl({value: true, disabled: true}),
      tag_8: new FormControl(false)
    });

    this.radioTagsForm = new FormGroup({
      selected_option: new FormControl('any')
    });

    this.switchersForm = new FormGroup({
      notifications: new FormControl(true),
      email_notifications: new FormControl(false)
    });

    this.counterForm = new FormGroup({
      counter: new FormControl(5, counterRangeValidator(1, 7)),
      counter2: new FormControl(2, counterRangeValidator(1, 5))
    });

    this.ratingForm = new FormGroup({
      rate: new FormControl(2.5),
      rate2: new FormControl(1.5)
    });

    this.radioColorForm = new FormGroup({
      selected_color: new FormControl('#fc9961')
    });
  }
  ngOnInit(): void {
    // get questions based on survey passed in notifications
    this.getQuestions();
  }
  rangeChange(range: Range) {
    console.log('range change', range);
  }

  getQuestions(){
  this.surveyService.getQuestions(this.surveyService.myParam).then((questiondata)=>{
    console.log("Question data...");
    this.questions = questiondata;
    console.log(this.questions);
  })
  }
  submitSurvey(){
    console.log("Survey submitted--->")
    console.log(this.responses);
    console.log("FIrst element")
    console.log(this.responses[0]);
    // iterate through each survey response=
    this.surveyService.responses = this.responses;
    this.surveyService.submitSurvey(this.responses);
    // this.presentAlert();
    this.navCtrl.navigateBack('app/categories');

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Thank you!',
      message: 'Your response have been recorded.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
