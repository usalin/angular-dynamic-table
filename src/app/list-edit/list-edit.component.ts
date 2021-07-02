import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListService } from '../list.service';
import { CompletionStatus, List, PassedObject, Priority } from '../models/list';

@Component({
  selector: 'app-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.scss']
})
export class ListEditComponent implements OnInit {
  isOpened: boolean = false;
  listForm: FormGroup;
  priorities: Priority[] = [];
  statuses: CompletionStatus[] = [];
  selectedCompletionStatus: number = null;
  priorityColors = ['priorityOne', 'priorityTwo', 'priorityThree'];
  @ViewChild('defaultDate') defaultDate: string;

  


  constructor(
    public dialog: MatDialog,
              public cdk: OverlayContainer,
              public dialogRef: MatDialogRef<ListEditComponent>,
              @Inject(MAT_DIALOG_DATA) public passedData: PassedObject,
              private formBuilder: FormBuilder,
              private listService: ListService,
  ) { }

  ngOnInit(): void {
    console.log(this.passedData.operation);
    if(this.passedData.operation == 'Edit') {this.createEditListForm();}
    if(this.passedData.operation == 'Create') {this.createNewListForm();}

    this.getPriorities();
    this.getCompletionStatuses();
  }

  createEditListForm() {   
    this.listForm = this.formBuilder.group({
     listName: [this.passedData.list.name, Validators.required],
     description: [this.passedData.list.description, [Validators.required]],
     dueDate: [new Date(this.passedData.list.dueDate)],
     priority: [''],
     status : [''],
    })
  }
  createNewListForm() {
    this.listForm = this.formBuilder.group({
      listName: ['', Validators.required],
      description: ['', [Validators.required]],
      dueDate: [new Date()],
      priority: [''],
      status : [''],
     })
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.listForm.value);

    if(this.listForm.valid) {
      if(this.passedData.operation == 'Edit') {
        const updatedList: List = {
          id: this.passedData.list.id,
          name: this.listForm.get('listName').value,
          imgUrl: this.passedData.list.imgUrl,
          description: this.listForm.get('description').value,
          dueDate: this.listForm.get('dueDate').value,
          priority: this.listForm.get('priority').value,
          status : this.listForm.get('status').value,
          isCompleted: false,
          isExpanded: true,
          subjects:["Science","Math"]

        }
        this.listService.updateItem(updatedList).subscribe(data => {
          console.log(data);
          this.dialogRef.close(data);

        });
      }
      else {
        const newList: List = {
          name: this.listForm.get('listName').value,
          description: this.listForm.get('description').value,
          dueDate: this.listForm.get('dueDate').value,
          priority: this.listForm.get('priority').value,
          status : this.listForm.get('status').value,
          imgUrl: '',
          isCompleted: false,
          isExpanded: true,
          subjects:["Science","Math"]
        }
        
        this.listService.createItem(newList).subscribe(data => {
          console.log(data);
          this.dialogRef.close(data);
        });
      }
    }
  }  
  getPriorities() {
    this.listService.getPriorities().subscribe(data => {
      this.priorities = data;

      if(this.passedData.operation == 'Edit') {    
        this.listForm.get('priority').setValue(this.passedData.list.priority);
      }
          
    })
  }
  getPriorityColor(priorityValue){


   if(priorityValue == 1) return 'priorityOne';
   else if(priorityValue == 2) return 'priorityTwo';
   else if(priorityValue == 3) return 'priorityThree';

   else return 'priorityOne';
  }

  getCompletionStatuses() {
   this.listService.getCompletionStatus().subscribe(data => {
     console.log(data);
     this.statuses = data;
     this.selectedCompletionStatus = this.statuses[1].id;

     if(this.passedData.operation == 'Edit') {    
      this.listForm.get('status').setValue(this.selectedCompletionStatus);
    }
     
   })
  }

  get dob() {
    if(this.passedData.operation == 'Edit') {      return new Date(this.passedData.list.dueDate);}
    return new Date();
    }

  get date(){
    if(this.passedData.operation == 'Edit') {      return new Date(this.passedData.list.dueDate);}
    return new Date();
  }
  
  get listName() {
    return this.listForm.get('listName');
  }
  get description() {
   return this.listForm.get('description');
 }



}
