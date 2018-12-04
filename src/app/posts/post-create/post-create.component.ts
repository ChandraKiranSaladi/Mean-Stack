import {Component, OnInit} from '@angular/core';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';

@Component({

  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  private postId = '';
  post: Post;
  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.min(3)]}),
      content: new FormControl(null, {validators: Validators.required}),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
        this.isLoading = false;
        this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: null};

        // setValue allows you to set values of all the inputs
        this.form.controls['title'].setValue(this.post.title);
        this.form.controls['content'].setValue(this.post.content);

        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }

    });
  }

  OnSavePost() {

    if (this.form.invalid) {
      console.log('invalid');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log('form.value.title: ' + this.form.value.title );
      console.log('form.value.content: ' + this.form.value.content );
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      console.log('form.value.title: ' + this.form.value.title );
      console.log('form.value.content: ' + this.form.value.content );
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

  OnImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
     // patchValue allows to control the value of single input
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    } ;
    reader.readAsDataURL(file);
  }

}
