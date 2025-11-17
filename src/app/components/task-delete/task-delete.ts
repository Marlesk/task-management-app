import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Task } from 'src/app/shared/interfaces/task';
import { TaskService } from 'src/app/shared/services/task/task.service';

@Component({
  selector: 'app-task-delete',
  imports: [],
  templateUrl: './task-delete.html',
  styleUrl: './task-delete.css',
})
export class TaskDelete {
  dialogRef = inject(DialogRef);        // Αναφορά στο Dialog service για να χειριστούμε το modal

  taskService = inject(TaskService);

  // Δεδομένα που περνάνε στο modal
  data = inject(DIALOG_DATA) as { task: Task; message: string };    

  // Κλείνει το modal χωρίς να επιβεβαιωθεί η διαγραφή
  closeDialog(){
    this.dialogRef.close();
  }

  // Επιβεβαιώνει τη διαγραφή και κλείνει το modal 
  onConfirm() {
    this.taskService.deleteTask(this.data.task._id).subscribe({
      next: () => {
        this.dialogRef.close(); 
        this.taskService.loadTasks();
      },
      error: (error) => console.log('Error deleting task', error) 
    });
    
  }
}
