import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import { Observable, throwError } from 'rxjs';
//import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any[]>('http://localhost:4040/api/student/all');
  }

}
