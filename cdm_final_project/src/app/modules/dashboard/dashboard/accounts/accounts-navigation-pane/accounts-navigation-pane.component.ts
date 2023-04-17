import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddAccountFormComponent } from '../add-account-form/add-account-form.component';

@Component({
  selector: 'app-accounts-navigation-pane',
  templateUrl: './accounts-navigation-pane.component.html',
  styleUrls: ['./accounts-navigation-pane.component.css']
})
export class AccountsNavigationPaneComponent {
  constructor(private dialog:MatDialog){
    this.addAccount();
  }
  animateIcon(icon:HTMLElement,classToBeAdded:string){
    icon.classList.add(classToBeAdded);
    icon.style.color="#2a2185";
  }
  removeAnimation(icon:HTMLElement,classToBeRemoved:string){
    icon.classList.remove(classToBeRemoved);
    icon.style.color="white";
  }
  

  addAccount(){
    
    this.dialog.open(AddAccountFormComponent,{
      
      maxHeight: 'calc(100vh - 120px)',
      backdropClass: "backgroundblur",
     
    });
  }
}
