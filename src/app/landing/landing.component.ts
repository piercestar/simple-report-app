import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fromEventPattern } from 'rxjs';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Report } from '../models/report';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ReportService } from '../services/report.service';



@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class LandingComponent implements OnInit {

  constructor(private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private reportService: ReportService) { }

  displayedColumns: string[] = ['id', 'name', 'created_dt', 'modified_dt', 'status',  'edit'];
  dataSource : MatTableDataSource<Report>;
  expandedElement: Report | null;
  user: User;

  ngOnInit(): void {
    this.userService.currentUser.subscribe( user => {
      this.user = user
    })

    this.refresh();
  }

  refresh() {
    this.reportService.getAll().subscribe( reports => {
      this.dataSource = new MatTableDataSource<Report>(reports);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createReport(): void {
    // this.router.navigate(['/create']);

    const dialogRef = this.dialog.open(CreateComponent, {
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  editReport(element): void {

    console.log(element.content);

    const dialogRef = this.dialog.open(EditComponent, {
      width: '700px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  deleteReport(element): void {
    this.reportService.delete(element.report_id).subscribe(
      () => { 
        this.refresh();
      }
    );
  }

  approve(element) {
    this.reportService.approve(element).subscribe(
      () => { 
        this.refresh();
      }
    );
  }

  reject(element) {
    this.reportService.reject(element).subscribe(
      () => { 
        this.refresh();
      }
    );
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
