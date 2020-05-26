import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms'; 
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createForm;

  constructor(private router: Router, private dialogRef: MatDialogRef<CreateComponent>, private formBuilder: FormBuilder, private reportService: ReportService) { 
    this.createForm = this.formBuilder.group({
      name: '',
      created_dt: new Date(),
      status: 'pending',
      content: ''
    })
  }
 
  ngOnInit(): void {
  }

  return() {
    this.dialogRef.close();
  }

  save() {
    if (this.createForm.invalid) {
      return;
    }
    this.reportService.create(this.createForm.value).subscribe( () =>{
      this.dialogRef.close();
    });
    
  }

}
