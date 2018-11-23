import { Post } from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {

    this.http.get<{message: String, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
          return postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content
            };
          });
      }))
      .subscribe((transformedData) => {
        this.posts = transformedData;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    console.log(`addpost: ${post}`);
    this.http.post<{message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
          console.log(responseData);
          const id = responseData.postId;
          post.id = id;
          this.posts.push(post);
          this.postUpdated.next([...this.posts]);
      });


  }
}
