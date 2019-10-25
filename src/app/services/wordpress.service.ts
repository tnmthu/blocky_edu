import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  constructor(private http: HttpClient) {
  }

  getPosts(): Observable<any[]> {
    let posts = this.http.get<any[]>('https://blocky.edu.vn/wp-json/wp/v2/posts?_embed');
    console.log(posts);
    return posts;
  }
}
