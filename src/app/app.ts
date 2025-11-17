import { Component, inject, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Main } from './components/main/main';
import { Task } from './shared/interfaces/task';

@Component({
  selector: 'app-root',
  imports: [Header, Main ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('task-management');
  searchTerm: string = '';    // Η τιμή που θα πάρει από το child Header μέσω του Output

}
