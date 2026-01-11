import { Component, signal } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vista-ti-books-frontend');
  isSearchRoute = true;

  constructor(
    private location: Location,
    private router: Router
  ) {
    this.isSearchRoute = this.router.url.startsWith('/search') || this.router.url === '/';
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isSearchRoute = this.router.url.startsWith('/search') || this.router.url === '/';
      });
  }

  goBack() {
    this.location.back();
  }
}