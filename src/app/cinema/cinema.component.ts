import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CinemaInfoService } from '../service/cinema-info.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})

export class CinemaComponent implements OnInit {
  
  villes:any;
  cinemas:any;
  salles:any;
  currentVille;
  currentSeance;
  currentCinema;
  currentSalle;
  currentProjection;
  currentTicket;
  actualProjection;
  selectedProjection;
  selectedTicktes;
  nbrSalles = 0;
  nbrPlaces = 0;
  clicked=false;
  popUpAlert=false;
  success: boolean;
  headerSuccess;
  headerFailure;
  successMessage;
  errorMessage;
  headerMessage;
  bodyMessage;

  constructor(public cinemaService: CinemaInfoService, private notifyService : NotificationService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles().subscribe(data => { 
      this.villes = data;
    },error => { 
      console.log(error);
    });
  }

  onGetCinema(ville:any) { 
    this.currentVille=ville;
    this.salles=null;
    this.nbrSalles=0;
    this.cinemaService.getCinemas(ville).subscribe(data => { 
      this.cinemas = data;
    },error => { 
      console.log(error);
    });
  }

  onGetSalles(cinema :any) {
    this.currentCinema = cinema;
    this.nbrSalles = cinema.nbrSalles; 
    this.cinemaService.getSalles(cinema).subscribe(data => { 
      this.salles = data;
      //console.log(this.salles);
      this.nbrPlaces = this.salles._embedded.salles[0].nbrPlaces;
      this.salles._embedded.salles.forEach(s => {
        //console.log(s);
         this.cinemaService.getProjections(s).subscribe(data => { 
           s.projections = data;
         },error => { 
           console.log(error);
         });
      });
    },error => { 
      console.log(error);
    });
  }

  onGetPlaces(projection: any) {
    this.clicked = true;
    this.currentProjection=projection;
    this.actualProjection=projection;
    this.currentSalle = projection.salle.id;
    this.selectedProjection = projection;
    console.log(this.actualProjection);
    this.cinemaService.getTicketsProjection(projection).subscribe(data => { 
      this.currentProjection = data;
      this.currentTicket = this.currentProjection._embedded.tickets;
      this.selectedTicktes = [];
    },error => { 
      console.log(error);
    });
  }

  onSelectedTicket(ticket: any) {
    if(!ticket.selected) { 
      ticket.selected = true;
      this.selectedTicktes.push(ticket);
    }else { 
      ticket.selected = false;
      this.selectedTicktes.splice(this.selectedTicktes.indexOf(ticket),1);
    }
    //console.log(this.selectedTicktes);
  }

  getTicketClass(ticket: any) {
    let class_btn = "btn";
    if(ticket.reserve==true) {
      class_btn+=" btn-danger";
    }else if(ticket.selected==true){
      class_btn+=" btn-warning";
    }else {
      class_btn+=" btn-success";
    }
    return class_btn;
  }

  onPayerTicket(form) {
    console.log(form);
    if(form.codePaiement!=""){
      let tickets = [];
      this.selectedTicktes.forEach(element => {
        tickets.push(element.id);
      });
      form.tickets = tickets;
      this.cinemaService.updateTickets(form).subscribe(data => { 
        //console.log(this.actualProjection);
        this.success = true;
        this.hideAlert();
      },error => { 
        console.log(error);
      });
    }else{
      this.success = false;
      console.log(this.success);
    }
  }

  getAlertClass() {
    let alertClass="alert alert-dismissible fade show";
    if(this.success){
      this.headerSuccess="Félicitation !";
      this.successMessage="Votre paiement a été enregistré avec success";
      this.headerMessage = this.headerSuccess;
      this.bodyMessage = this.successMessage;
      alertClass+=" alert-success";
    }else{
      this.headerFailure="Echec !!";
      this.errorMessage="Votre paiement n'a pas été enregistré !!";
      this.headerMessage = this.headerFailure;
      this.bodyMessage = this.errorMessage;
      alertClass+=" alert-danger";
    }
    return alertClass;
  }
  
  hideAlert() {
    setTimeout(()=> {
      this.popUpAlert = false;
      this.success = false;
      this.onGetPlaces(this.actualProjection);
    }, 3000);
  }
}
