import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';

import * as firebase from 'firebase/app';
require('firebase/auth')

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './styles/login.page.scss'
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  email:string    = "";
  password:string = "";

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
    public router: Router,
    public menu: MenuController,
    private firebaseCordova:Firebase,
  ) {
    this.loginForm = new FormGroup({
      'email': new FormControl('test@test.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  doLogin(): void {


    console.log('do Log In');
    firebase.auth().signInWithEmailAndPassword(this.email,this.password)
    .then((user)=>{
      console.log("Printing user...")
      console.log(user);
      // sign the userup for cloud messaging to enable notifications
      this.firebaseCordova.getToken().then((token)=>{
        console.log("Printing token...")
        console.log(token)
        this.updateToken(token, firebase.auth().currentUser.uid);
      }).catch((error)=>{
        console.log("Error fired")
        console.log(error)
      })

    }).catch((err)=>{
      console.log(err);
    })


    this.router.navigate(['app/notifications']);
  }

  updateToken(token:string, uid:string):void {

    firebase.firestore().collection("users").doc(uid).set({
      token:token,
      tokenUpdated:firebase.firestore.FieldValue.serverTimestamp()
    },{
      merge:true

    }).then(()=>{
      console.log("token saved to cloud firestore")
    }).catch((error)=>{
      console.log(error)
    })

  }


  goToForgotPassword(): void {
    console.log('redirect to forgot-password page');
  }

  doFacebookLogin(): void {
    console.log('facebook login');
    this.router.navigate(['app/categories']);
  }

  doGoogleLogin(): void {
    console.log('google login');
    this.router.navigate(['app/categories']);
  }

  doTwitterLogin(): void {
    console.log('twitter login');
    this.router.navigate(['app/categories']);
  }
}
