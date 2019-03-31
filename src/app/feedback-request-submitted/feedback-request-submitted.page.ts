import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback-request-submitted',
  templateUrl: './feedback-request-submitted.page.html',
  styleUrls: ['./feedback-request-submitted.page.scss'],
})
export class FeedbackRequestSubmittedPage implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() {
  }

  back(){
    this.router.navigate(['/feedback-request-friends']);
  }

}
