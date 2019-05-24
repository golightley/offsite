import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-email-confirm',
  templateUrl: './forgot-email-confirm.page.html',
  styleUrls: ['./forgot-email-confirm.page.scss'],
})
export class ForgotEmailConfirmPage implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  gotoLogin() {
    this.router.navigate(['/auth/login']);
  }

}
