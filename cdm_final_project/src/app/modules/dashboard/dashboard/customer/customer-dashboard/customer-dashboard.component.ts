import { Component, Input, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import {NgConfirmService} from 'ng-confirm-box'
import { NgToastService } from 'ng-angular-popup';
import {Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog'
import { CreateCustomerComponent } from '../create-customer/create-customer.component';
import { ICustomer } from 'src/app/datatypes/customer';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {

  customersList:ICustomer[]|undefined;
  public users:any=[];
  markers: { lat: number; lng: number; label: string }[]=[{lat : 22.4064172,
    lng : 69.0750171,
    label : "name"}];
   
  constructor(private dialog: MatDialog, private _customerService: CustomerService, private router: Router, private confirm:NgConfirmService, private toastService: NgToastService){}
  ngOnInit(): void {
    this.showCustomerList();
  }

  showCustomerList(){
    this._customerService?.getAllCustomers().subscribe((result:ICustomer[] | undefined)=>{
      this.customersList=result;
    })
  }

  
  //Toggle
   onToggleClick(){
    let navigation = document.querySelector(".navigation") as HTMLDivElement;
    let main = document.querySelector(".main") as HTMLDivElement;
    let toggle=document.querySelector(".fa-bars") as HTMLIFrameElement;
    navigation.classList.toggle("active");
    main.classList.toggle("active");
    toggle.classList.add("fa-flip");
    setTimeout(()=>{
      toggle.classList.remove("fa-flip");
    },500);
  }

  //Edit a customer..
  updateCustomer(email?:string |null){
    let dialogRef=this.dialog.open(CreateCustomerComponent,{
      
      data: {
        status: 'updateCustomer',
        customerId: email,
      },
      maxHeight: 'calc(100vh - 120px)',
      backdropClass: "backgroundblur",
     
    });
    dialogRef.afterClosed().subscribe((result)=>{
      this.showCustomerList();
    })

  }


  // Delete a Customer

  deleteCustomer(id?:string | null, cname?:string |null){
      
    this.confirm.showConfirm(`Are you sure want to delete ${cname}?`, async ()=>{
      if(id)this._customerService.deleteCustomer(id).subscribe(res=>{
        
        if(res)this.toastService.success({detail:'SUCCESS', summary: 'Deleted Successfully', duration: 3000});
        this.showCustomerList();
      })
      await new Promise(f=>{
        setTimeout(f, 1000)
      });
      window.location.reload();
    }, ()=>{

    })
    
  }

  mapCall(cname?:string |null, id?:string | null){
    if(id)this._customerService.getCustomer(id).subscribe(result=>{
      if(result){
        let accounts = result.accounts;
      this.markers.pop();
      if (accounts)
        accounts.forEach((account) => {
          let obj: { lat: number; lng: number; label: string } = {
            lat: account.location?.latitude? account.location?.latitude:22.4064172,
            lng:  account.location?.longitude? account.location?.longitude: 69.0750171,
            label:  account.aname? account.aname:'AName'
          };

          this.markers?.push(obj);
        });
        console.log(this.markers);

        if(this.markers.length>0){
          this.dialog.open(MapComponent,{
            data: {
              customerName: cname,
              customerId: id
            },
            height: 'calc(100vh-60px)',
            width:'60%',
            backdropClass: "backgroundblur",
            
           
          });
        }
        else{
          this.toastService.info({detail:'INFO', summary: 'No Accounts exist!', duration: 3000});
        }
      }
    })
    
  }


  // Search bar implementation
  searchVal(data:HTMLInputElement){
    // console.log(data.value);
    
    if(!data.value){
      this.showCustomerList();
    }
    if(data.value)this._customerService.searchCustomers(data.value).subscribe(result=>{
      if(result)this.customersList=result;
    })
    // if(!data.value)console.log(this.customersList);
  }
}
