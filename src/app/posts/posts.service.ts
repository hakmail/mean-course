import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts :Post[], postCount: number}>();

  constructor (private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    //return [...this.posts];
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map(postData => {
      return {
        posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }),
        maxPosts: postData.maxPosts
      };
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts});
    });
  }

  getPostUpdatedistenr() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    //return { ...this.posts.find(p => p.id === id) };
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPosts(title: string, content: string, image: File) {
    //const post: Post = {id: null, title: title, content: content};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData).subscribe((responseData) => {
      // console.log(responseData.message);
      // const id = responseData.postId;
      // post.id = id;

      // const post: Post = {id: responseData.post.id, title: title, content: content, imagePath:responseData.post.imagePath};
      // this.posts.push(post);
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string,title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    //const post: Post = {id: id, title: title, content: content, imagePath: null};
    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe(response => {
      // console.log(response);
      // const updatedPosts = [...this.posts];
      // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      // const post: Post = {
      //   id: id,
      //   title: title,
      //   content: content,
      //   imagePath: ""
      // }
      // updatedPosts[oldPostIndex] = post;
      // this.posts = updatedPosts;
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
    // .subscribe((responseData) => {
    //   const updatedPosts = this.posts.filter(post => post.id !== postId);
    //   this.posts = updatedPosts;
    //   this.postUpdated.next([...this.posts]);
    // });
  }

}
