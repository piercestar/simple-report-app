import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table';
import { RegisterComponent } from '../register/register.component'
import { MatDialog } from '@angular/material/dialog';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  error = false;
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  displayedColumns: string[] = ['id', 'user', 'password', 'role', 'delete'];
  dataSource: MatTableDataSource<User>;

  constructor(private router:Router,  public dialog: MatDialog, private svc:UserService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.svc.getAll().subscribe( data => {
      this.dataSource = new MatTableDataSource<User>(data);
    });
  }

  login() {
    if (this.form.valid) {
      this.svc.login(this.form.value.username, this.form.value.password).subscribe(
        data => {
          this.router.navigate(['./landing']);
        },
        error => {
          this.error = error.error.message;
        }
      );
    }
  }

  register() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.refresh();
    });
  }

  deleteUser(user) {
    this.svc.delete(user.id).subscribe( () => {
      this.refresh();
    });
  }

}
