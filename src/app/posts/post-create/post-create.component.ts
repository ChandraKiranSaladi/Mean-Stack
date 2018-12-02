import {Component, OnInit} from '@angular/core';

import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ParamMap, ActivatedRoute } from '@angular/router';

@Component({

  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId = '';
  post: Post;
  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }

    });
  }

  OnSavePost(form: NgForm) {

    if (form.invalid) {
      console.log('invalid');
      return;
    }
    if (this.mode === 'create') {
      console.log('form.value.title: ' + form.value.title );
      console.log('form.value.content: ' + form.value.content );
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      console.log('form.value.title: ' + form.value.title );
      console.log('form.value.content: ' + form.value.content );
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm();
  }

}
