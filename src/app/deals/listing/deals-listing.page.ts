import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DealsListingModel } from './deals-listing.model';
import { SurveyServiceService } from '../../services/survey-service.service';
import * as firebase from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

require('firebase/auth')

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
  results: any = [];


  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(
    private route: ActivatedRoute,
    public surveyService: SurveyServiceService,
    private http:HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
    if (this.route && this.route.data) {
      // We resolved a promise for the data Observable
      const promiseObservable = this.route.data;
      console.log('Route Resolve Observable => promiseObservable: ', promiseObservable);
      
      //get results to show for each card 
      this.getResults();

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

  getResults(){
    this.surveyService.getResults(firebase.auth().currentUser.uid).then((resultsData)=>{
      this.results = resultsData;
      console.log(this.results);
    })
  }

  viewComments(result){
    // store question ID in service
    this.surveyService.myParam = result;
    // navigate to [routerLink]="['/app/user/friends']"
    this.router.navigateByUrl('/app/user/friends');
  }

  // this should be moved to the service 
  like(result){
    console.log("Like function fired...");
    let body  = {
      questId:result.id,
      userId: firebase.auth().currentUser.uid,
      action: "like"
    }
    this.http.post("https://us-central1-offsite-9f67c.cloudfunctions.net/updateLikesCount", JSON.stringify(body),{
      responseType:"text"
    }).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error)
    })
  }
}
