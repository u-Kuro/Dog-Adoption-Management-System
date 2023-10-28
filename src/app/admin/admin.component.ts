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
  user: User = new User
  pendingAdoptions: PendingAdoption[] = []
  inputDog: Dog = new Dog
  inputDogBirthDay: Date | undefined

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
            this.user = data[0]
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
    this.dogAdoptionService.GetAllDogs().subscribe((dogs: Dog[]) => {
      this.dogAdoptionService.GetPendingAdoptions().subscribe((pendingAdoptions: PendingAdoption[]) => {
        this.dogs = dogs
        this.pendingAdoptions = pendingAdoptions
        dogs.forEach((dog: Dog) => {
          this.dogAdoptionService.IsDogAvailable(dog.id).subscribe((isAvailable) => {
            if (isAvailable) {
              dog.status = "Available"
            } else {
              dog.status = "Pending"
              for (let pendingAdoption of this.pendingAdoptions) {
                console.log(pendingAdoption.dogId, dog.id, pendingAdoption)
                if (dog.id === pendingAdoption.dogId) {
                  pendingAdoption.dog = dog
                  this.dogAdoptionService.GetPersonById(pendingAdoption.userId).subscribe((person) => {
                    pendingAdoption.user = person
                  })
                  break;
                }
              }
            }
          })
        })
      })
    })
  }

  public deleteDog(event: Event, dog: Dog) {
    event.stopPropagation()
    this.dogAdoptionService.DeleteDog(dog.id).subscribe(() => {
      this.refreshData()
    })
  }

  public saveDog(event: Event, dog: Dog) {
    event.stopPropagation()
    if (!this.inputDog.name && !this.inputDog.breed && !this.inputDogBirthDay) {
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
    if (this.inputDog.name) {
      savedDog.name = this.inputDog.name
    }
    if (this.inputDog.breed) {
      savedDog.breed = this.inputDog.breed
    }
    if (this.inputDogBirthDay) {
      savedDog.birthTimestamp = new Date(this.inputDogBirthDay).getTime()
      if (savedDog.birthTimestamp > (new Date()).getTime()) {
        return alert("Invalid: birthday was set in the future.")
      }
    }
    this.dogAdoptionService.UpdateDog(dog.id, savedDog).subscribe(() => {
      this.refreshData()
    })
  }

  public addDog() {
    let savedDog: {
      name: String | undefined,
      breed: String | undefined,
      birthTimestamp: number | undefined
    } = {
      name: undefined,
      breed: undefined,
      birthTimestamp: undefined
    };
    if (!(this.inputDog.name && this.inputDog.breed && this.inputDogBirthDay)) {
      return alert("Please fill up all the fields.")
    } else {
      savedDog.name = this.inputDog.name
      savedDog.breed = this.inputDog.breed
      savedDog.birthTimestamp = new Date(this.inputDogBirthDay).getTime()
      if (savedDog.birthTimestamp > (new Date()).getTime()) {
        return alert("Invalid: birthday was set in the future.")
      }
    }
    this.dogAdoptionService.AddDog(savedDog).subscribe(() => {
      this.refreshData()
    })
  }

  public setDogToUpdate(dog: Dog): void {
    this.inputDog.name = dog.name
    this.inputDog.breed = dog.breed
    if (dog.birthTimestamp) {
      this.inputDogBirthDay = new Date(dog.birthTimestamp)
    } else {
      this.inputDogBirthDay = undefined
    }
  }

  public approveAdoption(pendingAdoption: PendingAdoption): void {
    this.dogAdoptionService.DeletePendingAdoption(pendingAdoption.id).subscribe(() => {
      this.dogAdoptionService.DeleteDog(pendingAdoption.dogId).subscribe(() => [
        this.refreshData()
      ]);
    });
  }

  public rejectAdoption(pendingAdoption: PendingAdoption): void {
    this.dogAdoptionService.DeletePendingAdoption(pendingAdoption.id).subscribe(() => {
      this.refreshData()
    });
  }
}
