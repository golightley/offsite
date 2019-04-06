import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {SurveyServiceService} from '../services/survey-service.service';

require('firebase/auth');

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: [
    './styles/notifications.page.scss',
    './styles/notifications.shell.scss'
  ]
})
export class NotificationsPage implements OnInit {

  notifications: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public surveyService: SurveyServiceService,

    ) { }

  ngOnInit() {
    let userId = 'AKfOgVZrSTYsYN01JA0NUTicf703';
    if (firebase.auth().currentUser && firebase.auth().currentUser.uid) {
      userId = firebase.auth().currentUser.uid;
    }

    // get notification data from the survey service
    this.surveyService.getNotifications(userId).then(notificationData => {
      this.notifications = notificationData;
      console.log(this.notifications);
    });
  }

  teamSurvey(notification) {
    this.surveyService.myParam = notification;
    this.router.navigateByUrl('/forms-filters');
  }
}
