import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms'; 
import { ReportService } from '../services/report.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  updateForm;

  constructor(private dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder, private reportService: ReportService) {
    this.updateForm = this.formBuilder.group({
      report_id: this.data.report_id,
      name: this.data.name,
      created_dt: this.data.created_dt,
      modified_dt: this.data.modified_dt,
      status: this.data.status,
      content: this.data.content
    })

    console.log(this.data.content);
   }

  ngOnInit(): void {
  }

  return() {
    this.dialogRef.close();
  }

  save() {
    if (this.updateForm.invalid) {
      return;
    }
    this.reportService.update(this.updateForm.value).subscribe( () =>{
      console.log(this.updateForm.value)
      this.dialogRef.close();
    });
  }

}
