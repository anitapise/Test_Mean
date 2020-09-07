import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User;
  users: User[];
  readonly baseURL = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  postUser(user: User) {
    console.log(user);
    let userdata = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
	    "phone": user.phone
    };
    let formData: FormData = new FormData();
    let headers = new HttpHeaders();

    formData.append('data', JSON.stringify(userdata));
    if(user.profile_file)
        formData.append('attachment', user.profile_file);

    headers.append('enctype', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post(this.baseURL, formData, {headers: headers});
  }

  getUserList() {
    return this.http.get(this.baseURL);
  }

  putUser(user: User) {
    return this.http.put(this.baseURL + `/${user._id}`, user);
  }

  deleteUser(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}
