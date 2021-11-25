import { Component, OnInit } from '@angular/core';
import { PostService } from '../post/post.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public postService: PostService) { }
datas:any[]=[]
  ngOnInit(): void {
    this.datas=this.postService.getUserData()
  }

}
