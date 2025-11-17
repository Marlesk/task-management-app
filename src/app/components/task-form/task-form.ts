import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Tag } from 'src/app/shared/interfaces/tag';
import { TagService } from 'src/app/shared/services/tag/tag.service';
import { TaskService } from 'src/app/shared/services/task/task.service';

@Component({
  selector: 'app-task-form',
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})

export class TaskForm {
  priority: number = 1;                   // Τρέχουσα τιμή προτεραιότητας
  dialogRef = inject(DialogRef);          // Αναφορά στο dialog, χρησιμοποιείται για να κλείνει το modal

  tags: Tag[] = [];                       // Λίστα με όλα τα διαθέσιμα tags από το backend
  tagService = inject(TagService);        // Service για την αλληλεπίδραση με το backend για τα tags
  taskService = inject(TaskService);      // Service για την αλληλεπίδραση με το backend για τα tasks
  
  // Δημιουργία Reactive Form για task 
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    tag: new FormControl('', Validators.required),
    priority: new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(5)
    ])
  })

  // Φόρτωση των tags από το backend για το dropdown της φόρμας 
  ngOnInit() {
    this.tagService.getTags().subscribe({
      next: (tags) => this.tags = tags,
      error: (error) => console.log('Error loading tags', error)
    });
  }

  // Κλείνει το modal όταν πατηθεί το κουμπί X
  closeDialog(): void {
    this.dialogRef.close();
  }

  // Αύξηση προτεραιότητας, μέχρι μέγιστο 5
  increase() {
    const value = this.taskForm.get('priority')!.value!
    if (value < 5) {
      this.taskForm.get('priority')!.setValue(value + 1)
    }
  }

  // Μείωση προτεραιότητας, μέχρι ελάχιστο 1
  decrease() {
    const value = this.taskForm.get('priority')!.value!
    if (value > 1) {
      this.taskForm.get('priority')!.setValue(value - 1)
    }
  }

  onSubmit() {
    if (this.taskForm.valid){
      const formValue = this.taskForm.value;
      const newTask = {
        title: formValue.title!,
        description: formValue.description!,
        priority: formValue.priority!,
        status: 'to_do' as const,
        tag_id: this.taskForm.get('tag')?.value!
      };
      this.taskService.createTask(newTask).subscribe({
        next: (task) => {
          this.taskService.loadTasks(); //refresh 
          this.dialogRef.close(task)},
        error: (error) => console.log('Error creating task', error)
      }) 
    }
  }
}
