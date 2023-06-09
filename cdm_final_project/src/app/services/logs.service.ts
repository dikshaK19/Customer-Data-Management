import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ilog } from '../datatypes/log';
import { IPaginatedResults } from '../datatypes/paginatedResults';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(private _http: HttpClient) { }
  private baseUrl:string='https://datatrackrapi.azurewebsites.net/api/Logs'
  getAllLogs(){
    return this._http.get<Ilog[]>(`${this.baseUrl}`);
   }
   
   getAllLogsPaginated(StartIndex:number,PageNumber:number,PageSize:number){
    // https://datatrackrapi.azurewebsites.net/api/Logs$fetch?StartIndex=0&PageNumber=1&PageSize=10
    return this._http.get<IPaginatedResults<Ilog>>(`${this.baseUrl}$fetch?StartIndex=${StartIndex}&PageNumber=${PageNumber}&PageSize=${PageSize}`);
   }


   searchLogs(data:string){
    return this._http.get<Ilog[]>(`${this.baseUrl}$like?search=${data}`);
  }

   postLogs(Logs: Ilog)
   {
    return this._http.post<Ilog>(`${this.baseUrl}`, Logs);
   }


}
