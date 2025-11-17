import { Component, inject, Input } from '@angular/core';
import { TaskBoard } from '../task-board/task-board';
import { Dialog } from '@angular/cdk/dialog';
import { TaskForm } from '../task-form/task-form';
import { Task } from 'src/app/shared/interfaces/task';
import { Tag } from 'src/app/shared/interfaces/tag';
import { TaskService } from 'src/app/shared/services/task/task.service';
import { TagService } from 'src/app/shared/services/tag/tag.service';

@Component({
  selector: 'app-main',
  imports: [ TaskBoard ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  @Input() searchTerm: string = '';     //Η τιμή αναζήτησης που θα πάρει από τον parent App

  tasks: Task[] = [];
  
  tags: Tag[] = [];

  taskService = inject(TaskService);      // Service για την αλληλεπίδραση με το backend για τα tasks
  tagService = inject(TagService)         // Service για την αλληλεπίδραση με το backend για τα tags

  dialog = inject(Dialog);      // Αναφορά στο Dialog service για άνοιγμα modals
  tasks$ = this.taskService.tasks$; //Συνδέει το signal

   // Φόρτωση tasks του χρήστη
  ngOnInit() {
    this.taskService.loadTasks(); // Γεμίζει το signal

    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (error) => console.log('Error loading tasks', error)
    });

    this.tagService.getTags().subscribe({
      next: (tags) => this.tags = tags,
    });
    
  }

  // Φιλτράρει τα task από την αναζήτηση
  filteredTasks() {
    const tasks = this.tasks$(); // τραβάει από το signal
    if (!this.searchTerm) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Ανοίγει το modal για δημιουργία νέου Task
  // Εκτελείται όταν ο χρήστης πατήσει το πλαίσιο με την εικόνα
  openAddTaskModal() {
    this.dialog.open(TaskForm, {
      width: '700px',
      disableClose: true,
    })
  }

}
