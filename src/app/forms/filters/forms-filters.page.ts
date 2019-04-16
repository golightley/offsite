import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SurveyServiceService} from '../../services/survey-service.service';
import {AlertController, NavController} from '@ionic/angular';
import {QuestionModel, QuestionType} from '../../deals/listing/deals-listing.model';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'forms-filters-page',
  templateUrl: './forms-filters.page.html',
  styleUrls: [
    './styles/forms-filters.page.scss'
  ]
})
export class FormsFiltersPage implements OnInit {
  radioTagsForm: FormGroup;
  questions: QuestionModel[] = [];
  responses: any = {};

  constructor(
    public surveyService: SurveyServiceService,
    private navCtrl: NavController,
    public alertController: AlertController,
    private vibration: Vibration
    ) {
    this.radioTagsForm = new FormGroup({
      selected_option: new FormControl('any')
    });
  }
  ngOnInit() {
    // get questions based on survey passed in notifications
    this.getQuestions();
  }
  getQuestions() {
    const surveyId = this.surveyService.myParam.data().survey;

    this.surveyService.getQuestions(surveyId).then(questionData => {
      questionData.forEach(data => {
        const question = new QuestionModel(data.id, data.data());
        this.questions.push(question);
        if (question.type === QuestionType.input) {
          this.responses[question.id] = '';
        } else {
          this.responses[question.id] = '1';
        }
      });
      console.log(this.questions);
      console.log('Responses', this.responses);
    });
  }
  submitSurvey() {
    // iterate through each survey response=
    this.surveyService.responses = this.responses;
    this.surveyService.submitSurvey(this.responses);
    // this.presentAlert();
    this.navCtrl.navigateBack('app/categories');
  }

  vibrate(){
    // Vibrate the device for a second
    // Duration is ignored on iOS.
    this.vibration.vibrate(1000);
    console.log("Vibrate");
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
