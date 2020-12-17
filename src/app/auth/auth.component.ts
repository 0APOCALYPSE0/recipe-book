import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoggedIn:boolean = true;
  isLoading:boolean = false;
  error:string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  closeSub:Subscription;

  constructor(private authService:AuthService, private router:Router, private componentFactoryResolver:ComponentFactoryResolver) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoggedIn = !this.isLoggedIn;
  }

  onSubmit(form:NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs:Observable<AuthResponseData>;
    this.isLoading = true;

    if(this.isLoggedIn){
      authObs = this.authService.login(email, password);
    }else{
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe(data => {
      // console.log(data);
      this.isLoading = false;
      this.router.navigate(['./recipes']);
    },
    errorMessage => {
      // console.log(errorMessage);
      this.error = errorMessage;
      this.showErrorAlert(errorMessage)
      this.isLoading = false;
    });
    
    form.reset();
  }

  onHandleError(){
    this.error = null;
  }

  showErrorAlert(message:string){
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  // ngOnDestroy(){
  //   this.closeSub.unsubscribe();
  // }

}
