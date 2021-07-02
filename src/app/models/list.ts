export interface List {
   id?: number;
   name: string;
   imgUrl: string;
   description?: string;
   dueDate: string;
   priority: Priority;
   isCompleted: boolean;
   status: CompletionStatus;
}

export interface LimitedList {
   id: number;
   name: string;
   description: string;
}

export interface Priority {
   id: number;
   value: number;
 }
 export interface CompletionStatus {
   id: number;
   value: string;
 }

 export interface PassedObject {
   list: List;
   id: string;
   operation: string
 }
 export interface PassedInnerObject {
   list: List;
   id: string;
   name: string;
 }

 export interface Task {
   id: number;
   name: string;
   description: string;
   listId: number;
 }