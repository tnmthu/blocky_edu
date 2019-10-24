import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { WordpressService } from '../../services/wordpress/wordpress.service';

@Component({
  selector: 'app-wordpress',
  templateUrl: './wordpress.component.html',
  styleUrls: ['./wordpress.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WordpressComponent implements OnInit {
  posts: Observable<any[]>;

  constructor(private wordpress: WordpressService) { 
    this.posts = this.wordpress.getPosts();
  }

  ngOnInit() {
  }

}
