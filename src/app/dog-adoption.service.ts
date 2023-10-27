import { Observable } from "rxjs";
import { Dog } from "./model/dog";
import { User } from "./model/user";
import { Admin } from "./model/admin";
import { PendingAdoption } from "./model/pending-adoption";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DogAdoptionService {
  APIUrl: string

  constructor(private http: HttpClient) {

    this.APIUrl = 'http://localhost:18080/api';

  }

  //Dog
  public IsDogAvailable(id: number): Observable<Dog[]> {
    return this.http.get<Dog[]>(this.APIUrl + '/is-dog-available/' + id.toString());
  }

  GetAvailableDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.APIUrl}/available-dogs`);
  }

  GetAllDogs(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.APIUrl}/dogs`);
  }

  GetDogById(id: number): Observable<Dog> {
    return this.http.get<Dog>(`${this.APIUrl}/dog/${id}`);
  }

  AddDog(dog: Dog): Observable<object> {
    return this.http.post<object>(`${this.APIUrl}/add-dog`, dog);
  }

  UpdateDog(id: number, dog: object): Observable<object> {
    return this.http.put<object>(`${this.APIUrl}/update-dog/${id}`, dog);
  }

  DeleteDog(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/delete-dog/${id}`);
  }

  //Person 
  GetPeople(): Observable<User[]> {
    return this.http.get<User[]>(`${this.APIUrl}/people`);
  }

  GetPersonById(id: number): Observable<User> {
    return this.http.get<User>(`${this.APIUrl}/person/${id}`);
  }

  AddPerson(person: object): Observable<object> {
    return this.http.post<object>(`${this.APIUrl}/add-person`, person);
  }

  UpdatePerson(id: number, person: object): Observable<object> {
    return this.http.put<object>(`${this.APIUrl}/update-person/${id}`, person);
  }

  DeletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/delete-person/${id}`);
  }

  //Admin
  IsAdmin(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.APIUrl}/is-admin/${userId}`);
  }

  AddAdmin(adminData: object): Observable<object> {
    return this.http.post<object>(`${this.APIUrl}/add-admin`, adminData);
  }

  DeleteAdmin(userId: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/delete-admin/${userId}`);
  }

  //PAS
  GetPendingAdoptions(): Observable<PendingAdoption[]> {
    return this.http.get<PendingAdoption[]>(`${this.APIUrl}/pending-adoptions`);
  }

  GetPendingAdoptionById(id: number): Observable<PendingAdoption> {
    return this.http.get<PendingAdoption>(`${this.APIUrl}/pending-adoption/${id}`);
  }

  AddPendingAdoption(adoption: object): Observable<object> {
    return this.http.post<object>(`${this.APIUrl}/add-pending-adoption`, adoption);
  }

  DeletePendingAdoption(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/delete-pending-adoption/${id}`);
  }

  GetUserPendingAdoptions(userid: number): Observable<PendingAdoption[]> {
    return this.http.get<PendingAdoption[]>(`${this.APIUrl}/user-pending-adoptions/${userid}`);
  }

}
