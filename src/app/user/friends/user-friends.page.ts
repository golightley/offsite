import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyServiceService } from '../../services/survey-service.service';
import { UserFriendsModel } from './user-friends.model';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.page.html',
  styleUrls: [
    './styles/user-friends.page.scss',
    './styles/user-friends.shell.scss',
    './styles/user-friends.md.scss'
  ]
})
export class UserFriendsPage implements OnInit {
  data: UserFriendsModel;

  segmentValue = 'friends';
  friendsList: Array<any>;
  followersList: Array<any>;
  comments: Array<any>;
  followingList: Array<any>;
  searchQuery = '';
  showFilters = false;
  message: any;

  @HostBinding('class.is-shell') get isShell() {
    return (this.data && this.data.isShell) ? true : false;
  }

  constructor(
    private route: ActivatedRoute,    
    public surveyService: SurveyServiceService,
    ) { }

  ngOnInit(): void {

    //log the question id 
    console.log("Logging param that has been set...")
    console.log(this.surveyService.myParam)
    
    //get the comments 
    this.getComment();
    this.updateComment();

  }

  getComment(){
        //gert
        this.surveyService.getComments(this.surveyService.myParam.id).then((commentData)=>{
          this.comments = commentData;
          console.log(this.comments);
        })

        
  }

  updateComment(){
    let query = firebase.firestore().collection("comments").where("questionId", "==", this.surveyService.myParam.id)

    query.onSnapshot((snapshot)=>{
      console.log("Changed")
      console.log(snapshot)

      //retrieve anything that has changed
      let changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {

        if(change.type == "added"){
          console.log("added...")
          console.log(change.doc);
          this.comments.push(change.doc);       
        }

        if(change.type == "modified"){

        }
        
        if(change.type == "removed"){

        }

      })

    })
  }

  createComment(){
    // create the comment 
    this.surveyService.createComment(this.surveyService.myParam.id, this.message);
    // reset the message 
    this.message = '';
  }

  segmentChanged(ev): void {
    this.segmentValue = ev.detail.value;
    // Check if there's any filter and apply it
    this.searchList();
  }
  
  // scrollBottom() {
  //   var that = this;
  //   setTimeout(function () {
  //     that.content.scrollToBottom();    
  //   }, 300);
  // }


  searchList(): void {
    const query = (this.searchQuery && this.searchQuery !== null) ? this.searchQuery : '';

    if (this.segmentValue === 'friends') {
      this.friendsList = this.filterList(this.data.friends, query);
    } else if (this.segmentValue === 'followers') {
      this.followersList = this.filterList(this.data.followers, query);
    } else if (this.segmentValue === 'following') {
      this.followingList = this.filterList(this.data.following, query);
    }
  }

  filterList(list, query): Array<any> {
    return list.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }
}

