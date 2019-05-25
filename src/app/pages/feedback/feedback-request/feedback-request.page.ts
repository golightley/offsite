import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-feedback-request',
  templateUrl: './feedback-request.page.html',
  styleUrls: ['./feedback-request.page.scss'],
})
export class FeedbackRequestPage {
  constructor(private router: Router) {}

  onClickBtnDone() {
    this.router.navigateByUrl('app/feedback');
  }
}
