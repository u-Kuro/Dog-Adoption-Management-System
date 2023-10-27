import { User } from './user'
import { Dog } from './dog'

export class PendingAdoption {
    id: number = 0
    user: User = new User
    userID: number = 0
    dog: Dog = new Dog
    dogID: number = 0
}
