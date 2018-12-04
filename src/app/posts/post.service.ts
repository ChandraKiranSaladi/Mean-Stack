import { Post } from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {

    this.http.get<{message: String, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
          return postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
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

  getPost(id: String) {
    return this.http.get<{_id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content, imagePath: null};
    this.http.put<{}>('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        const UpdatedPosts = [...this.posts];
        const OldPostIndex = UpdatedPosts.findIndex(p => p.id === id );
        UpdatedPosts[OldPostIndex] = post;
        this.posts = UpdatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
        console.log(response);
      });
  }

  addPost(title: string, content: string, image: File) {

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    console.log(`addpost: ${postData}`);
    this.http.post<{message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
          const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath };
          console.log(responseData);
          this.posts.push(post);
          this.postUpdated.next([...this.posts]);
          this.router.navigate(['/']);
      });


  }
}
