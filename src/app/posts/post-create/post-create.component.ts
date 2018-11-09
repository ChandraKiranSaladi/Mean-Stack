import {Component} from '@angular/core';

@Component({

  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent {
  userPost = '';
  enteredValue = '';
  onAddPost() {
    this.userPost = 'Napolean Bonaparte\'s quote' + this.enteredValue;
  }
}
