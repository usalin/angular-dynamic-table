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

export class Group {
  level: number = 0;
  parent: Group;
  expanded: boolean = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}


const USER_SCHEMA = {
  "id": "number",
  "name": "text",
  "description": "text",
  "imgUrl": "text",
  "dueDate": "date",
  "priority": "number",
  "isCompleted": "boolean",
  "status": "status",
  "subjects":"subject",
  "edit": "edit",
  "delete": "delete",
  "create": "create",
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ["name", "description", "imgUrl", "dueDate", "priority", "isCompleted", "status","subjects", "edit", "delete", "create"];
  dataSchema = USER_SCHEMA;
  list: List;
  public dataSource = new MatTableDataSource([]);
  groupingColumn;
  reducedGroups = [];
  initialData: any [];
  inputData: any;


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
  initData(data){
    this.initialData = data;
    return true;
  }

  setDataSource() {
    this.listService.getLists().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data);
        this.inputData = data;
        this.initData(this.inputData);

        this.dataSource = this.groupBy(this.groupingColumn, data, this.reducedGroups);

        // this.dataSource.paginator = this.matPaginator;
        // this.dataSource.sort = this.matSort;
      }
    );

  }

  groupBy(column:string,data: any[],reducedGroups?: any[]){
    if(!column) return data;
    let collapsedGroups = reducedGroups;
    if(!reducedGroups) collapsedGroups = [];
    const customReducer = (accumulator, currentValue) => {
      let currentGroup = currentValue[column];
      if(!accumulator[currentGroup])
      accumulator[currentGroup] = [{
        groupName: `${column} ${currentValue[column]}`,
        value: currentValue[column], 
        isGroup: true,
        reduced: collapsedGroups.some((group) => group.value == currentValue[column])
      }];
      
      accumulator[currentGroup].push(currentValue);

      return accumulator;
    }
    let groups = data.reduce(customReducer,{});
    let groupArray = Object.keys(groups).map(key => groups[key]);
    let flatList = groupArray.reduce((a,c)=>{return a.concat(c); },[]);

    return flatList.filter((rawLine) => {
        return rawLine.isGroup || 
        collapsedGroups.every((group) => rawLine[column]!=group.value);
      });
  }

  isGroup(index, item): boolean{
    return item.isGroup;
  }
  reduceGroup(row){
    row.reduced=!row.reduced;
    if(row.reduced)
      this.reducedGroups.push(row);
    else
      this.reducedGroups = this.reducedGroups.filter((el)=>el.value!=row.value);
    
    this.setDataSource();
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
 
}
