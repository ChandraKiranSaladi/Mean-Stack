import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';
@Component({

    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postSub: Subscription;
  // To add a service , add a constructor
  constructor(public postService: PostService) {


  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}


