import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { concatMap, filter, share, shareReplay, switchMap, tap } from 'rxjs/operators';
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
  "edit": "edit",
  "delete": "delete",
  "create": "create"
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  displayedColumns: string[] = ["name", "description",  "imgUrl",  "dueDate", "priority", "isCompleted",  "edit", "delete", "create"];
  dataSource$ = this.listService.getLists();
  dataSchema = USER_SCHEMA;
  list: List;
  obs: Observable<List[]>;

  constructor(private dialog: MatDialog,
              private listService: ListService) {
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
      this.dataSource$ = this.listService.getLists();

      
      console.log("The dialog was closed with data: " + result);
      this.list = result;
      this.dialog.closeAll();
    });
  } 
  openDeleteDialog(element: List) : void {
    const passedElement = element;
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: "680px",
      data: passedElement,
      id: "parent",
      disableClose: true
    });
    
    // this.dataSource$ = dialogRef.afterClosed().pipe(
    //   switchMap(result => {
    //     if(result) {
    //       return this.listService.deleteItem(element);
    //     }
    //     else{
    //       return of("false");
    //     }
    //     }
    //   ),
    //   tap((data)=> {console.log(data);
    //   }),
    //   switchMap( (data) => this.listService.getLists()),
    //   tap(()=> this.dialog.closeAll())
    // )

dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.listService.deleteItem(element).subscribe(() => {   
          
          this.dataSource$ = this.listService.getLists();     
          });
          this.dialog.closeAll();
    
      }});






  }
}

    // this.dataSource$ = dialogRef.afterClosed().pipe(
    //   switchMap(result => {
    //     if(result) {
    //       return this.listService.deleteItem(element);
    //     }
    //     else{
    //       return of("false");
    //     }
    //     }
    //   ),
    //   tap((data)=> {console.log(data);
    //   }),
    //   switchMap( (data) => this.listService.getLists()),
    //   tap(()=> this.dialog.closeAll())
    // )}

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result) {
    //     this.listService.deleteItem(element).subscribe(() => {   
          
    //       this.dataSource$ = this.listService.getLists();     
    //       });
    //       this.dialog.closeAll();

    //   }
    // });
