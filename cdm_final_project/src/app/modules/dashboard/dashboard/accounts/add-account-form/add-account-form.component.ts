import { Component, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { IAccount } from 'src/app/datatypes/account';
import {ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-account-form',
  templateUrl: './add-account-form.component.html',
  styleUrls: ['./add-account-form.component.css']
})
export class AddAccountFormComponent {
  constructor(private _accountsService:AccountsService,private matDialogRef:MatDialogRef<AddAccountFormComponent>,@Inject(MAT_DIALOG_DATA) private data:{
    status: string;
    account: IAccount | null;
    email:string;
},private route:ActivatedRoute){}
  addProductMessage:string|undefined;
  ngOnInit(){
    if(this.data.status==='updateAccount'){
      if(this.data.account)this.accountAddForm.patchValue(this.data.account);
    }
  }

    addAccount(){
      // console.log("Add ACcount Form: "+this.accountAddForm.value.acc_email);
      this.accountAddForm.value.customer_email=this.data.email;
      console.log(this.accountAddForm.value);
      this.accountAddForm.value.acc_revenue=Math.floor((Math.random()*101));
      this._accountsService.addAccount(this.accountAddForm.value).subscribe((result)=>{
        if(result){
          console.log("Account Added");
        }
      });
    }

    updateAccount(){
      // console.log(this.accountAddForm.value);
      this._accountsService.updateAccount(this.accountAddForm.value,this.accountAddForm.value.acc_email).subscribe(result=>{
        if(result){
          // console.log(result);
          console.log("Account Updated");
        }
      });
    }

    accountFormSubmit(){
      if(this.data.status==='addAccount'){
        this.addAccount();
      }
      else if(this.data.status==='updateAccount'){
        this.updateAccount();
      }
    }

    accountAddForm = new FormGroup({
      acc_email:new FormControl('',[Validators.required,Validators.email]),
      aname:new FormControl('',[Validators.required]),
      location:new FormControl('',[Validators.required]),
      estYear:new FormControl('',[Validators.required]),
      description:new FormControl('',[Validators.required]),
      acc_revenue:new FormControl(0),
      customer_email:new FormControl(this.data.email)
    });
   
    
    get aname(){
      return this.accountAddForm.get('aname');
    }
    get email(){
      return this.accountAddForm.get('acc_email');
    }
    get location(){
      return this.accountAddForm.get('location');
    }
    get estYear(){
      return this.accountAddForm.get('estYear');
    }
    get description(){
      return this.accountAddForm.get('description');
    }

    ngOnDestroy(){
      this.matDialogRef.close();
    }

}
