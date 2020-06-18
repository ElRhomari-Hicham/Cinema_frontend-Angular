import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CinemaInfoService {

  public url: String = "http://localhost:8085";

  constructor(private httpClient: HttpClient) { }

  public getVilles() { 
    return this.httpClient.get(this.url+"/villes");
  }

  public getCinemas(ville:any) { 
    return this.httpClient.get(ville._links.cinemas.href);
  }

  public getSalles(cinema:any) { 
    return this.httpClient.get(cinema._links.salles.href);
  }

  public getProjections(salle:any) { 
    let _link:String = salle._links.projections.href.replace("{?projection}","");
    //console.log(_link+"?projection=prj1");
    return this.httpClient.get(_link+"?projection=prj1");
  }

  public getTicketsProjection(projection: any){
    let _link:String = projection._links.tickets.href.replace("{?projection}","");
    //console.log(_link+"?projection=prj1");
    return this.httpClient.get(_link+"?projection=ticketProj");
  }

  public updateTickets(dataForm: any){
    return this.httpClient.post(this.url+"/paiementTickets",dataForm);
  }

}
