import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { Dog } from '../model/dog';
import { PendingAdoption } from '../model/pending-adoption';
import { DogAdoptionService } from '../dog-adoption.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  dogs: Dog[] = []
  User: User = new User
  pendingAdoption: PendingAdoption[] = []
  constructor(
    private dogAdoptionService: DogAdoptionService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.dogAdoptionService.GetPeople().subscribe((data: User[]) => {
      this.User = data[0]
      if (data[0]) {
        this.User = data[0]
        this.dogAdoptionService.GetAllDogs().subscribe((data: Dog[]) => {
          this.dogs = data
          data.forEach((dog: Dog) => {
            this.dogAdoptionService.IsDogAvailable(dog.id).subscribe((data) => {
              dog.status = data ? "Available" : "Pending"
            })
          })
        })
        this.dogAdoptionService.GetPendingAdoptions().subscribe((data: PendingAdoption[]) => { this.pendingAdoption = data })
      } else {
        this.dogAdoptionService.AddPerson({
          firstName: "dummy",
          lastName: "dummy",
          email: "dummy@gmail.com",
          password: ""
        }).subscribe(() => {
          this.dogAdoptionService.GetPeople().subscribe((data: User[]) => {
            this.User = data[0]
            if (data[0]) {
              this.User = data[0]
            }
            this.dogAdoptionService.GetAllDogs().subscribe((data: Dog[]) => {
              this.dogs = data
              data.forEach((dog: Dog) => {
                this.dogAdoptionService.IsDogAvailable(dog.id).subscribe((data) => {
                  dog.status = data ? "Available" : "Pending"
                })
              })
            })
            this.dogAdoptionService.GetPendingAdoptions().subscribe((data: PendingAdoption[]) => { this.pendingAdoption = data })
          })
        })
      }
    })

  }


}
