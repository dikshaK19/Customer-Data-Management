import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICustomer } from '../datatypes/customer';
import { IPaginatedResults } from '../datatypes/paginatedResults';

@Injectable()
export class CustomerService {

  constructor(private _http: HttpClient) { }
  private baseUrl:string='https://datatrackrapi.azurewebsites.net/api/Customers'

   /********************  Get all Customers********************/
   getAllCustomers(){
    return this._http.get<ICustomer[]>(`${this.baseUrl}`);
   }
   getAllCustomersPaginated(StartIndex:number,PageNumber:number,PageSize:number){
    return this._http.get<IPaginatedResults<ICustomer>>(`${this.baseUrl}$fetch?StartIndex=${StartIndex}&PageNumber=${PageNumber}&PageSize=${PageSize}`);
   }

   /********************  Get a Customer by Id ********************/
   getCustomer(customerId: string){
    return this._http.get<ICustomer>(`${this.baseUrl}/${customerId}`);
   }
   getCustomerDetails(customerId: string){
    return this._http.get<ICustomer>(`${this.baseUrl}/CustomerDetails/${customerId}`);
   }

  /********************  Add a Customer********************/
  addCustomer(customer:ICustomer){
    return this._http.post<ICustomer>(`${this.baseUrl}`, customer);
  }

  /********************  Update a Customer********************/
  updateCustomer(customer: ICustomer, customerId: string)
  {
    return this._http.put<ICustomer>(`${this.baseUrl}/${customerId}`, customer);
  }

  /********************  Delete a Customer********************/

  deleteCustomer(customerId: string)
  {
    return this._http.delete<ICustomer>(`${this.baseUrl}/${customerId}`);
  }
  searchCustomers(data:string){
    return this._http.get<ICustomer[]>(`${this.baseUrl}$like?search=${data}`);
  }
}
