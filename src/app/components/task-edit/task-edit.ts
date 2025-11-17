import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tag } from 'src/app/shared/interfaces/tag';
import { Task } from 'src/app/shared/interfaces/task';
import { TaskService } from 'src/app/shared/services/task/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-edit',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-edit.html',
  styleUrl: './task-edit.css',
})
export class TaskEdit {
  dialogRef = inject(DialogRef);        // Αναφορά στο Dialog service για να χειριστούμε το modal

  taskService = inject(TaskService);

  // Δεδομένα που περνάνε στο modal
  data = inject(DIALOG_DATA) as { task: Task, tags: Tag[] };    

  // Δημιουργία φόρμας με τις αρχικές τιμές του task
  taskForm = new FormGroup({
      title: new FormControl(this.data.task.title, Validators.required),
      description: new FormControl(this.data.task.description, Validators.required),
      tag: new FormControl(this.data.task.tag_id, Validators.required),
      priority: new FormControl(this.data.task.priority, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ])
  });

  // Κλείνει το modal χωρίς να επιβεβαιωθεί η διαγραφή
  closeDialog(){
    this.dialogRef.close();
  };

  // Αύξηση προτεραιότητας, μέχρι μέγιστο 5
  increase() {
    const value = this.taskForm.get('priority')!.value!
    if (value < 5) {
      this.taskForm.get('priority')!.setValue(value + 1)
    }
  };

  // Μείωση προτεραιότητας, μέχρι ελάχιστο 1
  decrease() {
    const value = this.taskForm.get('priority')!.value!
    if (value > 1) {
      this.taskForm.get('priority')!.setValue(value - 1)
    }
  };

  // Format για το status
  statusDisplayName(status: string): string {
    return status.split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
  }


  // Αποθήκευση αλλαγής και κλείνει το modal 
  saveChanges() {
    if (!this.taskForm.valid) return;
    
    const formValue = this.taskForm.value;

    const updates = {
      title: formValue.title!,
      description: formValue.description!,
      priority: formValue.priority!,
      tag_id: this.taskForm.get('tag')?.value!
    };
    this.taskService.updateTaskFields(this.data.task._id, updates).subscribe({
      next: () => {
        this.taskService.setTaskFields(this.data.task._id, updates);
        this.taskService.loadTasks(); //refresh
        this.dialogRef.close(); 
      },
      error: (error) => console.log('Error updating task', error) 
    });
  }
}
