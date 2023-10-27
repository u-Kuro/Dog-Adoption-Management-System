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
  putDog: Dog = new Dog
  dogBirthDay: Date | undefined
  constructor(
    private dogAdoptionService: DogAdoptionService,
    private route: ActivatedRoute
  ) { }

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

  public delete(event: Event, dog: Dog) {
    event.stopPropagation()
    this.dogAdoptionService.DeleteDog(dog.id).subscribe(() => {
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
  }

  public save(event: Event, dog: Dog) {
    event.stopPropagation()
    if (!this.putDog.name && !this.putDog.breed && !this.dogBirthDay) {
      return alert("Please fill one of the fields.")
    }
    let savedDog: {
      name: String | undefined,
      breed: String | undefined,
      birthTimestamp: number | undefined
    } = {
      name: undefined,
      breed: undefined,
      birthTimestamp: undefined
    };
    if (this.putDog.name) {
      savedDog.name = this.putDog.name
    }
    if (this.putDog.breed) {
      savedDog.breed = this.putDog.breed
    }
    if (this.dogBirthDay) {
      savedDog.birthTimestamp = new Date(this.dogBirthDay).getTime()
      if (savedDog.birthTimestamp > (new Date()).getTime()) {
        return alert("Invalid: birthday was set in the future.")
      }
    }
    this.dogAdoptionService.UpdateDog(dog.id, savedDog).subscribe(() => {
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
  }

  public add() {
    let savedDog: {
      name: String | undefined,
      breed: String | undefined,
      birthTimestamp: number | undefined
    } = {
      name: undefined,
      breed: undefined,
      birthTimestamp: undefined
    };
    if (!(this.putDog.name && this.putDog.breed && this.dogBirthDay)) {
      return alert("Please fill up all the fields.")
    } else {
      savedDog.name = this.putDog.name
      savedDog.breed = this.putDog.breed
      savedDog.birthTimestamp = new Date(this.dogBirthDay).getTime()
      if (savedDog.birthTimestamp > (new Date()).getTime()) {
        return alert("Invalid: birthday was set in the future.")
      }
    }
    this.dogAdoptionService.AddDog(savedDog).subscribe(() => {
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
  }

  public setDogToUpdate(dog: Dog): void {
    this.putDog.name = dog.name
    this.putDog.breed = dog.breed
    if (dog.birthTimestamp) {
      this.dogBirthDay = new Date(dog.birthTimestamp)
    } else {
      this.dogBirthDay = undefined
    }
  }
}
