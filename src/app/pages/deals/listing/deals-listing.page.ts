import { Component, OnInit, HostBinding, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import {DealsListingModel, QuestionModel} from './deals-listing.model';
import { SurveyServiceService } from '../../../services/survey-service.service';
import * as firebase from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { attachEmbeddedView } from '@angular/core/src/view';
import { Chart } from 'chart.js';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
require('firebase/auth');

@Component({
  selector: 'app-deals-listing',
  templateUrl: './deals-listing.page.html',
  styleUrls: [
    './styles/deals-listing.page.scss',
    './styles/deals-listing.shell.scss',
    './styles/deals-listing.ios.scss'
  ]
})
export class DealsListingPage implements OnInit {
  listing: DealsListingModel;
  results: QuestionModel[] = [];
  message = 'what';
  page = 'what';
  unsubscribe: any;
  @ViewChild('valueBarsCanvas') valueBarsCanvas;
  valueBarsChart: any;
  chartData = null;
  navigationSubscription;
  userId: string;
  @HostBinding('class.is-shell') get isShell() {
    return this.listing && this.listing.isShell;
  }

  constructor(
    private route: ActivatedRoute,
    public surveyService: SurveyServiceService,
    private http: HttpClient,
    private router: Router,
    private zone: NgZone
    ) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd
          && (this.router.url === '/app/categories')) {
          this.initialiseInvites();
        }
        //console.log('[Result] router url = ' + this.router.url);
      });
    }

    initialiseInvites() {
      // Set default values and re-fetch any data you need.
      console.log('[Notification] initialiseInvites unsubscrib');
      if (this.unsubscribe !== undefined) {
          this.unsubscribe();
      }
      firebase.auth().onAuthStateChanged(user => {
        this.userId = user.uid;
        this.attachResultListener('pulse');
      });
    }

    ionViewDidLeave() {
      if (this.unsubscribe !== undefined) {
        this.unsubscribe();
      }
    }
     // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
      // avoid memory leaks here by cleaning up after ourselves. If we
      // don't then we will continue to run our initialiseInvites()
      // method on every navigationEnd event
      if (this.navigationSubscription) {
         this.navigationSubscription.unsubscribe();
      }
      console.log('[Notification] ngOnDestroy unsubscribe');
      if (this.unsubscribe !== undefined) {
        this.unsubscribe();
      }
    }

  ngOnInit(): void {
    if (this.route && this.route.data) {
      // We resolved a promise for the data Observable
      const promiseObservable = this.route.data;
      console.log('Route Resolve Observable => promiseObservable: ', promiseObservable);
      // Get results to show for each card
      // this.getResults();

      //this.attachResultListener('pulse');

      if (promiseObservable) {
        promiseObservable.subscribe(promiseValue => {
          const dataObservable = promiseValue['data'];
          console.log('Subscribe to promiseObservable => dataObservable: ', dataObservable);
          if (dataObservable) {
            dataObservable.subscribe(observableValue => {
              const pageData: DealsListingModel = observableValue;
              // tslint:disable-next-line:max-line-length
              console.log('Subscribe to dataObservable (can emmit multiple values) => PageData (' + ((pageData && pageData.isShell) ? 'SHELL' : 'REAL') + '): ', pageData);
              // As we are implementing an App Shell architecture, pageData will be firstly an empty shell model,
              // and the real remote data once it gets fetched
              if (pageData) {
                this.listing = pageData;
              }
            });
          } else {
            console.warn('No dataObservable coming from Route Resolver promiseObservable');
          }
        });
      } else {
        console.warn('No promiseObservable coming from Route Resolver data');
      }
    } else {
      console.warn('No data coming from Route Resolver');
    }
  }

  getResults(goal) {
    this.surveyService.getResults(firebase.auth().currentUser.uid,goal).then((resultsData: firebase.firestore.QueryDocumentSnapshot[]) => {
      resultsData.forEach(data => {
        this.results.push(new QuestionModel(data.id, data.data()));
      });
      console.log(this.results);
    });
  }

  updateListner(goal) {
    // this.unsubscribe();
    this.results = [];
    this.attachResultListener(goal);
    this.createChart('1');
  }

  attachResultListener(goal) {
    // entering attach listner
    console.log('[Result] Entering attached listner userID = ' + this.userId);

    if (goal === 'pulse') {
      // get team id
      this.surveyService.getTeamId(this.userId).then((team) => {
        console.log('[ResultListener] getActiveTeam = ' + team.data().teamId);
        this.getQuestions(goal, team.data().teamId);
      });
    } else {
      // get user id
      this.getQuestions(goal, this.userId);
    }
  }

  getQuestions(goal, teamId) {
        // teamID
        console.log('[ResultListener] call listener goal = ' + goal + ' teamId = ' + teamId);
        // pull the questions associated with that team
        const questions = [];
        const that = this;
        that.results = [];
        this.unsubscribe = firebase.firestore().collection('questions')
          .where('goal', '==', goal)
          .where('teamId', '==', teamId)
          .orderBy('lastUpdate', 'desc')
        .onSnapshot((snapshot) => {
          const changedDocs = snapshot.docChanges();
          changedDocs.forEach((change) => {
            if (change.oldIndex !== -1) {
              that.results.splice(change.oldIndex, 1);
            }
            if (change.newIndex !== -1) {
              console.log('[ResultListener] onSnapshot >> add...');
              const newQuestion = new QuestionModel(change.doc.id, change.doc.data());
              that.results.splice(change.newIndex, 0, newQuestion);
            }
            // UI Refresh
            this.zone.run(() => {});
            // if (change.type === 'added') {
            //   console.log('[Result] Added in listener');
            //   this.results.push(new QuestionModel(change.doc.id, change.doc.data()));
            // } else if (change.type === 'modified') {
            //   console.log('[Result] modify in listener');
            //   //let index = change.oldIndex;
            //   this.results[change.oldIndex] = new QuestionModel(change.doc.id, change.doc.data());
            //   // this.results.push(new QuestionModel(change.doc.id, change.doc));
            // }
          });
          // this.notifications = notifications;
        });
  }

  getMarkColorStyle(question: QuestionModel) {

    const score = question.avgScore;
    if (score >= 3.5) {
      return '#20dc6a';
    } else if (score >= 3.0 && score < 3.5) {
      return '#7de8a7';
    } else if (score >= 2 && score < 3.0) {
      return '#ff84b3';
    } else {
      return '#ff1a72';
    }
    // return 2.5 < question.avgScore ? '#20dc6a' : '#ff1a72';
  }

  ionViewDidLoad() {
    // this.createChart("1")
    // this.updateListner("pulse");
    //this.attachResultListener('pulse');
  }
  createChart(dataa) {

    // var data: [{
    //   x: 10,
    //   y: 20
    //  }, {
    //   x: 15,
    //   y: 10
    // }]

    // this.valueBarsChart = new Chart(this.valueBarsCanvas.nativeElement,{
    // type: 'line',
    // data: data,
    // options: {
    //     scales: {
    //         yAxes: [{
    //             stacked: true
    //         }]
    //     }
    // }

    // });

  }
  updateChart(data) {

  }

  viewComments(result) {
    // store question ID in service
    this.surveyService.myParam    = result;

    if (result.goal === 'feedback' && result.type === 'input') {
        this.surveyService.showBottom = false;
    } else {
      this.surveyService.showBottom = true;
    }
    this.router.navigate(['/app/categories/friends', { question: result.question }]);
  }
  // like(result) {
  //   console.log('Like function fired...');
  //   const body  = {
  //     questId: result.id,
  //     userId: firebase.auth().currentUser.uid,
  //     action: 'like'
  //   };
  //   this.http.post('https://us-central1-offsite-9f67c.cloudfunctions.net/updateLikesCount', JSON.stringify(body), {
  //     responseType: 'text'
  //   }).subscribe((data) => {
  //     console.log(data);
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }
}
