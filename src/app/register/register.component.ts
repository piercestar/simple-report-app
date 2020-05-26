import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms'; 
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm;
  username;
  password;
  submitted = false;
  error;

  constructor(private router: Router, private dialogRef: MatDialogRef<RegisterComponent>, private formBuilder: FormBuilder, private svc: UserService) { 
    this.registerForm = this.formBuilder.group({
      username: new FormControl(this.username, Validators.required),
      password: new FormControl(this.password, Validators.required),
    })

    console.log(this.registerForm.controls.password);
  }

  ngOnInit(): void {
  }

  return() {
    this.dialogRef.close();
  }

  save() {
    this.submitted = true;
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      return;
    } else {
      this.svc.register(this.registerForm.value).subscribe( data => {
        this.dialogRef.close();
      }, error => {
        this.error = error.error.message;
      });
      
    }
  }

}

