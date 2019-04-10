import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-feedback-logo',
  templateUrl: './feedback-logo.page.html',
  styleUrls: ['./feedback-logo.page.scss'],
})
export class FeedbackLogoPage {
  constructor(private router: Router) {
  }

  onClickBtnNext() {
    this.router.navigateByUrl('app/feedback/feedback-content');
  }
}
