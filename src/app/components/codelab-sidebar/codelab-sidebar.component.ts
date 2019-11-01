import { Component, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-codelab-sidebar',
  templateUrl: './codelab-sidebar.component.html',
  styleUrls: ['./codelab-sidebar.component.scss'],
  animations: [
    trigger('toggleSidebar', [
      state('hide', style({
        opacity: 0,
        width: 0,
        visibility: 'hidden'
      })),
      state('show', style({
        opacity: 1,
        width: '25%',
        visibility: 'visible'
      })),

      transition('hide => show', [animate('0.6s ease-out')]),
      transition('show => hide', [animate('0.6s ease-in')])
    ])
  ]
})
export class CodelabSidebarComponent implements OnInit {
  deviceList = ['haha', 'hihi', 'hoho', 'huhu'];

  @Input() isOpen = false;

  constructor() { }

  ngOnInit() {
  }

  getState() {
    return !this.isOpen ? 'hide' : 'show';
  }

}
