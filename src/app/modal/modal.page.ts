import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  val;
  message = "";
  constructor(public modalController: ModalController, public navParams:NavParams) { 
    this.val = navParams.get('prop1');

  }

  ngOnInit() {
  }

  dismiss(){
    this.modalController.dismiss();

  }
  makeSuggestion(){
    this.message = "Lets do a team dinner!"

  }

}
