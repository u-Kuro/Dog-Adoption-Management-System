import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { Dog } from '../model/dog';
import { PendingAdoption } from '../model/pending-adoption';
import { DogAdoptionService } from '../dog-adoption.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  availableDogs: Dog[] = []
  user: User = new User
  userPendingAdoptions: PendingAdoption[] = []

  constructor(
    private dogAdoptionService: DogAdoptionService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.dogAdoptionService.GetPeople().subscribe((data: User[]) => {
      this.user = data[0]
      if (data[0]) {
        this.user = data[0]
        this.refreshData()
      } else {
        this.dogAdoptionService.AddPerson({
          firstName: "dummy",
          lastName: "dummy",
          email: "dummy@gmail.com",
          password: ""
        }).subscribe(() => {
          this.dogAdoptionService.GetPeople().subscribe((data: User[]) => {
            if (data[0]) {
              this.user = data[0]
            }
            this.refreshData()
          })
        })
      }
    })
  }

  public refreshData() {
    const id = this.user.id || 1;
    this.dogAdoptionService.GetAvailableDogs().subscribe((data: Dog[]) => { this.availableDogs = data })
    this.dogAdoptionService.GetUserPendingAdoptions(id).subscribe((data: PendingAdoption[]) => { this.userPendingAdoptions = data })
  }

  public adopt(dog: Dog) {
    this.dogAdoptionService.AddPendingAdoption({ userId: this.user.id, dogId: dog.id }).subscribe(() => {
      this.refreshData()
    })
  }
}
