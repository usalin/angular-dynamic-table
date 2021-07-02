import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { ListEditComponent } from './list-edit/list-edit.component';
import { ListService } from './list.service';
import { List } from './models/list';

const USER_SCHEMA = {
  "id": "number",
  "name": "text",
  "description": "text",
  "imgUrl": "text",
  "dueDate": "date",
  "priority": "number",
  "isCompleted": "boolean",
  "status": "status",
  "expandedDetail":"boolean",
  "subjects":"subject",
  "edit": "edit",
  "delete": "delete",
  "create": "create",
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ["name", "description", "imgUrl", "dueDate", "priority", "isCompleted", "status","subjects","expandedDetail", "edit", "delete", "create"];
  dataSchema = USER_SCHEMA;
  list: List;
  public dataSource = new MatTableDataSource([]);
  isTableExpanded = false;


  @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  constructor(private dialog: MatDialog,
    private listService: ListService) {
  }
  ngOnInit() {
    this.setDataSource();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.matPaginator;
  }
  setDataSource() {
    this.listService.getLists().subscribe(
      data => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
    );

  }
  openDialog(list: List, action: string): void {
    const dialogRef = this.dialog.open(ListEditComponent, {
      width: "680px",
      data: { list: list, id: "parent", operation: action },
      id: "parent",
      disableClose: true //optional
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.setDataSource();
      }
      this.dialog.closeAll();
    });
  }
  openDeleteDialog(element: List): void {
    const passedElement = element;
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: "680px",
      data: passedElement,
      id: "parent",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listService.deleteItem(element).subscribe((result) => {
          this.setDataSource();
        });
        this.dialog.closeAll();
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getCheckboxColor(isComplete){    
    if(isComplete) return 'priorityOne';
   }
   toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.dataSource.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }
}
