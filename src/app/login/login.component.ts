import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../post/post.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  users: any;
  form!: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public postService: PostService) { }

  ngOnInit(): void {
    
    this.form = this.formBuilder.group({
      Username: '',
      Password: ''
    });
   
  }
  submit(): void {
    console.log("logged in...")
    //window.sessionStorage.setItem("Username ", this.form.value.Username);
    //window.sessionStorage.setItem("Password ", this.postService.encrypt(this.form.value.Password));
    //this.http.post('http://localhost/salesapp/api/login/service', this.form.getRawValue(), {
    this.http.post('http://localhost/login/api/Auth/authenticate', this.form.getRawValue(), {
      withCredentials: false
    }).subscribe(res => {
      this.users = res;
     //console.log(this.users)
     
      if (this.users.token.startsWith("Bearer ")) {
     
        window.sessionStorage.setItem("TKN", this.users.token);
        // window.sessionStorage.setItem("Name ", this.users.User.Name);
        window.sessionStorage.setItem("User_ID ", this.users.user_ID);
        
        this.router.navigate(['/dashboard']);
      
     
      }
     
      else {
        this.router.navigate(['/register']);
        //console.log(this.users + " You Need to register");
      }
   
    });
  }
}
