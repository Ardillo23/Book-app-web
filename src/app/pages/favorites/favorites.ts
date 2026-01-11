import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../services/books.service';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private readonly coverFallback = '/images/cover-skeleton.svg';
  favorites: any[] = [];
  loading = false;
  error = '';
  selectedBook: any | null = null;
  confirmBook: any | null = null;

  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  getCoverUrl(coverUrl: string | null | undefined) {
    if (!coverUrl || coverUrl === 'null' || coverUrl === 'undefined') {
      return this.coverFallback;
    }
    return coverUrl;
  }

  openModal(book: any) {
    this.selectedBook = book;
  }

  closeModal() {
    this.selectedBook = null;
  }

  requestRemove(book: any) {
    this.confirmBook = book;
  }

  cancelRemove() {
    this.confirmBook = null;
  }

  confirmRemove() {
    if (!this.confirmBook) return;
    const target = this.confirmBook;
    this.booksService.deleteFavorite(target.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter((book) => book.id !== target.id);
        this.confirmBook = null;
        if (this.selectedBook?.id === target.id) {
          this.selectedBook = null;
        }
      },
      error: () => {
        this.error = 'No se pudo eliminar de favoritos.';
        this.confirmBook = null;
      },
    });
  }

  private loadFavorites() {
    this.loading = true;
    this.error = '';

    this.booksService.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los favoritos.';
        this.loading = false;
      },
    });
  }
}
