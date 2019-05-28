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
    private pc : PopoverController,
    public loadingService: LoadingService,
    private navParams: NavParams,
    public router: Router,
    private menu: MenuController
  )
  {

  }

  ngOnInit()
  {
    
    this.userTeams = this.navParams.get('userTeams');
    this.activeTeam = this.navParams.get('activeTeam');
    console.log(this.activeTeam);
    //this.userId = firebase.auth().currentUser.uid;
    //this.getCurTeam();
    firebase.auth().onAuthStateChanged(user => {
      this.userId = user.uid;
      //this.getCurTeam();
    })
  }
  async getCurTeam()
  {
    const that = this;
    
    await this.loadingService.doFirebase(async () => {
      const docRef = firebase.firestore().collection('users').doc(that.userId);
      docRef.onSnapshot((snapshot) => {
        
            // console.log(change.doc.data());
            const userData = new UserModel(snapshot.data());
            that.activeTeam = userData.teamId;
      });
    })
  }

  async getUserTeams()
  {
    const that = this;
    await this.loadingService.doFirebase(async () => {
      console.log('[TeamSwitching] userId = ' + this.userId);
      const query = await firebase.firestore().collection('teams')
        .where('members', 'array-contains', { uid: this.userId });
      query.onSnapshot((snapshot) => {
        console.log('TeamSwitching Listener attached');
        // retrieve anything that has changed
          console.log('[TeamSwitching] team count = ', snapshot.size);
          const changedDocs = snapshot.docChanges();
          changedDocs.forEach((change) => {
            // console.log(change.doc.data());
            const userTeam = new UserTeamsModel(change.doc.data());
            userTeam.id = change.doc.id;
            if (change.oldIndex !== -1) {
              that.userTeams.splice(change.oldIndex, 1);
            }
            if (change.newIndex !== -1) {
              console.log('[TeamSwitching] doc id = ', change.doc.id);
              that.userTeams.splice(change.newIndex, 0, userTeam);
            }
          });
      });
    })
  }

  async selectTeam(teamdId: string)
  {
    console.log('[TeamSwitching] selectTeam = ' + teamdId);
    //this.activeTeam = teamdId;
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
