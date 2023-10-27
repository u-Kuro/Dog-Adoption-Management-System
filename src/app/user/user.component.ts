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
  availabledogs: Dog[] = []
  User: User = new User
  UserPendingAdoption: PendingAdoption[] = []
  constructor(
    private dogAdoptionService: DogAdoptionService,
    private route: ActivatedRoute,) { }


  ngOnInit(): void {
    this.dogAdoptionService.GetPeople().subscribe((data: User[]) => {
      this.User = data[0]
      if (data[0]) {
        this.User = data[0]
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
          })
        })
      }
    })
    const id = this.User.id || parseInt(this.route.snapshot.paramMap.get('id')!) || 1;
    this.dogAdoptionService.GetAvailableDogs().subscribe((data: Dog[]) => { this.availabledogs = data })
    this.dogAdoptionService.GetUserPendingAdoptions(id).subscribe((data: PendingAdoption[]) => { this.UserPendingAdoption = data })
  }

  public adopt(dog: Dog) {
    this.dogAdoptionService.AddPendingAdoption({ userId: this.User.id, dogId: dog.id }).subscribe(() => {
      const id = this.User.id || parseInt(this.route.snapshot.paramMap.get('id')!) || 1;
      this.dogAdoptionService.GetAvailableDogs().subscribe((data: Dog[]) => { this.availabledogs = data })
      this.dogAdoptionService.GetUserPendingAdoptions(id).subscribe((data: PendingAdoption[]) => { this.UserPendingAdoption = data })
    })
  }
}
