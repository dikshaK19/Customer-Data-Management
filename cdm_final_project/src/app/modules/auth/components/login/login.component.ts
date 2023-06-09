import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm!:FormGroup;
  signUpForm!:FormGroup;
  showForm = false;
  dialogRef: MatDialogRef<ForgotPasswordDialogComponent> | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  passwordMatchError: boolean = false;

  constructor(
              private fb:FormBuilder,
              private _router:Router,
              private toast:NgToastService,
              private _authService:AuthService,
              private _userService:UserService,
              private dialog: MatDialog,
              
  ){}


  ngOnInit(): void {

    if(this._authService.isLoggedIn()){
      this._router.navigate(['customerDashboard']);
    }
    else{
      this.signUpForm=this.fb.group({
      
        firstName:['',Validators.required],
        lastName:['',Validators.required],
        userName:['',Validators.required],
        email:['',Validators.required],
        password:['',Validators.required],
        confirmPassword:['',Validators.required]
     
         }),
  
      this.loginForm= this.fb.group({
        username:['',Validators.required],
        password:['',Validators.required]
       })
    }
  }

addSignup() {
  let container = document.querySelector(".container-login") as HTMLDivElement;
  container.classList.add("sign-up-mode");
};

removeSignup(){
  let container = document.querySelector(".container-login") as HTMLDivElement;
  container.classList.remove("sign-up-mode");
};

extractJWTToken(){
  let token:string | null=this._authService.getToken();
  try {
    type jwtToken={unique_name:string;role:string;nbf:number;iat:number;exp:number;email:string};
    let decodedToken:{unique_name:string;role:string;nbf:number;iat:number;exp:number;email:string} | undefined;
    if(token) decodedToken = jwt_decode<{unique_name:string;role:string;nbf:number;iat:number;exp:number;email:string}>(token);
    return decodedToken;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return undefined;
  }
}


openForgotPasswordDialog() {
  this.dialogRef = this.dialog.open(ForgotPasswordDialogComponent);
  this.dialogRef.afterClosed().subscribe(result => {
  });
}

OnLogin() {
  if(this.loginForm.valid)
  {
    this._authService.login(this.loginForm.value).subscribe({
       next:(res=>{
        this.loginForm.reset();
        this._authService.storeToken(res.Token);
        this.toast.success({detail:"SUCCESS", summary:res.Message,duration:5000});
        this._router.navigate(['customerDashboard']);
        this._userService.user=this.extractJWTToken();


      }),
      error:(err=>{
        alert(err?.error.Message)
      })
    })
  }
  else{
   
  }
 }

 OnSignUp()
  {
    if (this.password !== this.confirmPassword) {
      this.toast.error({
        detail: 'Error',
        summary: "Password doesn't match !",
        duration: 5000,
      });
      this.passwordMatchError = true;
    }
    else{
      this.passwordMatchError=false;
    }

      if(this.signUpForm.valid && !this.passwordMatchError)
      {
        this._authService.signUp(this.signUpForm.value).subscribe({
          next:(res=>{
            this.signUpForm.reset();
            this.removeSignup();
          }),
          error:(err=>{
            alert(err?.error.Message)
          })
        })
      }
      else
      {
    
      }
  }


}