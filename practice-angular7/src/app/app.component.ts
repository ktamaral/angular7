import { Component } from '@angular/core';

// ng generate component components/Todos

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:string = 'practice-angular7';

  // Constructor runs on instantiation
  constructor() {
    console.log(`${this.title}`);
  }
}
