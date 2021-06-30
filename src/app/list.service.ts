import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CompletionStatus, List, Priority } from './models/list';
import { map, retry } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  baseUrl = environment.fakeApiUrl;
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient,
             ) {
  }
  getLists() {
    let url = this.baseUrl + "lists";
    return this.http.get(url).pipe(
      map((data: List[]) => {
        if (data) {
          console.log(data + " logginaahang from inside the service");
          return data;
        }
      })
    );
  }

  getPriorities() {
    let url = this.baseUrl + "priorities";
    return this.http.get(url).pipe(
      map((data: Priority[]) => {
        if (data) {
          console.log(data + " logging from inside the service");
          return data;
        }
      })
    );
  }
  getCompletionStatus() {
    let url = this.baseUrl + "status";
    return this.http.get(url).pipe(
      map((data: CompletionStatus[]) => {
        if (data) {
          console.log(data + " logging from inside the service");
          return data;
        }
      })
    );
  }

  updateItem( item: List): Observable<List> {
    console.log(item);
    
    return this.http
      .put<List>(`${this.baseUrl}lists/${item.id}`, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
      )
  }

  createItem(item: List): Observable<List> {
    return this.http
      .post<List>(`${this.baseUrl}lists`, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
      )
  }

  
  deleteItem(item: List) {
    return this.http
      .delete<List>(`${this.baseUrl}lists/${item.id}`, this.httpOptions)
      .pipe(
        retry(2),
      )

    }


}
