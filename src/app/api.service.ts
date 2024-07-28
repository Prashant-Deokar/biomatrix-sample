import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public sendRequest(byteArray: any): Observable<any> {
    const url = 'https://api.example.com/endpoint'; // Replace with your API endpoint

    // Set request headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream' // Use the appropriate content type for your byte array
    });

    // Send the HTTP request
    return this.http.post(url, byteArray, { headers });
  }
}
