// /*
//   List Event :

//     codelab.tensorflow.voice.list
//     codelab.tensorflow.face.list
//     codelab.network.data
//     codelab.network.join
//     codelab.network.leave


//     device.status
//     device.join
//     device.leave


//     db.project.profile
//     db.user.profile

// */




// import { Injectable } from '@angular/core';
// import { ChatModule } from '../../chat.module';

// import { Observable, Observer } from 'rxjs';
// import { Message } from '../model/message';
// import { Event } from '../model/event';

// import * as socketIo from 'socket.io-client';



// $(document).ready(function() {
//   // Use a "/test" namespace.
//   // An application can open a connection on multiple namespaces, and
//   // Socket.IO will multiplex all those connections on a single
//   // physical channel. If you don't care about multiple channels, you
//   // can set the namespace to an empty string.
//   namespace = '/codelab';

//   // Connect to the Socket.IO server.
//   // The connection URL has the following format, relative to the current page:
//   //     http[s]://<domain>:<port>[/<namespace>]
//   var socket = io(namespace);

//   // Event handler for new connections.
//   // The callback function is invoked when a connection with the
//   // server is established.
//   socket.on('connect', function() {
//       socket.emit('my_event', {data: 'I\'m connected!'});
//   });

//   // Event handler for server sent data.
//   // The callback function is invoked whenever the server emits data
//   // to the client. The data is then displayed in the "Received"
//   // section of the page.
//   socket.on('my_response', function(msg, cb) {
//       $('#log').append('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
//       if (cb)
//           cb();
//   });

//   // Interval function that tests message latency by sending a "ping"
//   // message. The server then responds with a "pong" message and the
//   // round trip time is measured.
//   var ping_pong_times = [];
//   var start_time;
//   window.setInterval(function() {
//       start_time = (new Date).getTime();
//       socket.emit('my_ping');
//   }, 1000);

//   // Handler for the "pong" message. When the pong is received, the
//   // time from the ping is stored, and the average of the last 30
//   // samples is average and displayed.
//   socket.on('my_pong', function() {
//       var latency = (new Date).getTime() - start_time;
//       ping_pong_times.push(latency);
//       ping_pong_times = ping_pong_times.slice(-30); // keep last 30 samples
//       var sum = 0;
//       for (var i = 0; i < ping_pong_times.length; i++)
//           sum += ping_pong_times[i];
//       $('#ping-pong').text(Math.round(10 * sum / ping_pong_times.length) / 10);
//   });

//   // Handlers for the different forms in the page.
//   // These accept data from the user and send it to the server in a
//   // variety of ways
//   $('form#emit').submit(function(event) {
//       socket.emit('my_event', {data: $('#emit_data').val()});
//       return false;
//   });
//   $('form#broadcast').submit(function(event) {
//       socket.emit('my_broadcast_event', {data: $('#broadcast_data').val()});
//       return false;
//   });
//   $('form#join').submit(function(event) {
//       socket.emit('join', {room: $('#join_room').val()});
//       return false;
//   });
//   $('form#leave').submit(function(event) {
//       socket.emit('leave', {room: $('#leave_room').val()});
//       return false;
//   });
//   $('form#send_room').submit(function(event) {
//       socket.emit('my_room_event', {room: $('#room_name').val(), data: $('#room_data').val()});
//       return false;
//   });
//   $('form#close').submit(function(event) {
//       socket.emit('close_room', {room: $('#close_room').val()});
//       return false;
//   });
//   $('form#disconnect').submit(function(event) {
//       socket.emit('disconnect_request');
//       return false;
//   });
// });






// //# Soure File
// // https://github.com/zmyzheng/Socket-IO-Typescript-Chat-App/blob/d40bc04d12810a5ae1da06a087ec15ec62559789/client/src/app/chat/chat.component.ts
// import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
// import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';

// import { Action } from './shared/model/action';
// import { Event } from './shared/model/event';
// import { Message } from './shared/model/message';
// import { User } from './shared/model/user';
// import { SocketService } from './shared/services/socket.service';
// import { DialogUserComponent } from './dialog-user/dialog-user.component';
// import { DialogUserType } from './dialog-user/dialog-user-type';


// const AVATAR_URL = 'https://api.adorable.io/avatars/285';

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.css']
// })
// export class ChatComponent implements OnInit, AfterViewInit {
//   action = Action;
//   user: User;
//   messages: Message[] = [];
//   messageContent: string;
//   ioConnection: any;
//   dialogRef: MatDialogRef<DialogUserComponent> | null;
//   defaultDialogUserParams: any = {
//     disableClose: true,
//     data: {
//       title: 'Welcome',
//       dialogType: DialogUserType.NEW
//     }
//   };

//   // getting a reference to the overall list, which is the parent container of the list items
//   @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

//   // getting a reference to the items/messages within the list
//   @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

//   constructor(private socketService: SocketService,
//     public dialog: MatDialog) { }

//   ngOnInit(): void {
//     this.initModel();
//     // Using timeout due to https://github.com/angular/angular/issues/14748
//     setTimeout(() => {
//       this.openUserPopup(this.defaultDialogUserParams);
//     }, 0);
//   }

//   ngAfterViewInit(): void {
//     // subscribing to any changes in the list of items / messages
//     this.matListItems.changes.subscribe(elements => {
//       this.scrollToBottom();
//     });
//   }

//   // auto-scroll fix: inspired by this stack overflow post
//   // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
//   private scrollToBottom(): void {
//     try {
//       this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
//     } catch (err) {
//     }
//   }

//   private initModel(): void {
//     const randomId = this.getRandomId();
//     this.user = {
//       id: randomId,
//       avatar: `${AVATAR_URL}/${randomId}.png`
//     };
//   }

//   private initIoConnection(): void {
//     this.socketService.initSocket();

//     this.ioConnection = this.socketService.onMessage()
//       .subscribe((message: Message) => {
//         this.messages.push(message);
//       });


//     this.socketService.onEvent(Event.CONNECT)
//       .subscribe(() => {
//         console.log('connected');
//       });

//     this.socketService.onEvent(Event.DISCONNECT)
//       .subscribe(() => {
//         console.log('disconnected');
//       });
//   }

//   private getRandomId(): number {
//     return Math.floor(Math.random() * (1000000)) + 1;
//   }

//   public onClickUserInfo() {
//     this.openUserPopup({
//       data: {
//         username: this.user.name,
//         title: 'Edit Details',
//         dialogType: DialogUserType.EDIT
//       }
//     });
//   }

//   private openUserPopup(params): void {
//     this.dialogRef = this.dialog.open(DialogUserComponent, params);
//     this.dialogRef.afterClosed().subscribe(paramsDialog => {
//       if (!paramsDialog) {
//         return;
//       }

//       this.user.name = paramsDialog.username;
//       if (paramsDialog.dialogType === DialogUserType.NEW) {
//         this.initIoConnection();
//         this.sendNotification(paramsDialog, Action.JOINED);
//       } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
//         this.sendNotification(paramsDialog, Action.RENAME);
//       }
//     });
//   }

//   public sendMessage(message: string): void {
//     if (!message) {
//       return;
//     }

//     this.socketService.send({
//       from: this.user,
//       content: message
//     });
//     this.messageContent = null;
//   }

//   public sendNotification(params: any, action: Action): void {
//     let message: Message;

//     if (action === Action.JOINED) {
//       message = {
//         from: this.user,
//         action: action
//       }
//     } else if (action === Action.RENAME) {
//       message = {
//         action: action,
//         content: {
//           username: this.user.name,
//           previousUsername: params.previousUsername
//         }
//       };
//     }

//     this.socketService.send(message);
//   }
// }
