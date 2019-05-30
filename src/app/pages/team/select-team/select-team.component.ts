import { Component, OnInit } from '@angular/core';
import { NavParams,PopoverController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { LoadingService } from '../../../services/loading-service';
import { UserTeamsModel,UserModel } from './select-team.component.model';
import {Router, NavigationExtras} from '@angular/router';
import { MenuController } from '@ionic/angular';
require('firebase/auth');

@Component({
  selector: 'app-select-team',
  templateUrl: './select-team.component.html',
  styleUrls: ['./select-team.component.scss']
})
export class SelectTeamComponent implements OnInit {
  userTeams: any = [];
  userId: string = '';
  activeTeam: string = '';
  color: string = '';

  constructor(
    private pc: PopoverController,
    public loadingService: LoadingService,
    private navParams: NavParams,
    public router: Router,
    private menu: MenuController
  ) {

  }

  ngOnInit() {
    this.userTeams = this.navParams.get('userTeams');
    this.activeTeam = this.navParams.get('activeTeam');
    console.log(this.activeTeam);
    firebase.auth().onAuthStateChanged(user => {
      this.userId = user.uid;
    });
  }

  async selectTeam(teamdId: string) {
    console.log('[TeamSwitching] selectTeam = ' + teamdId);
    await this.loadingService.doFirebase(async () => {
      firebase.firestore().collection('users').doc(this.userId).update({
        'teamId': teamdId,
      }).then(async () => {
        console.log('teamId changed to cloud firestore');
        const navigationExtras: NavigationExtras = {
          replaceUrl: true,
          queryParams: {
            fromLoginScreen: 'true'
          }
        };
        this.router.navigate(['/app/notifications'], navigationExtras);
      }).catch((error) => {
        console.log(error);
      });
    });
    this.activeTeam = teamdId;
    this.pc.dismiss();
    this.menu.close();
  }
}
