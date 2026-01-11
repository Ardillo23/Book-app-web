import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private readonly coverFallback = '/images/cover-skeleton.svg';
  query = '';
  results: any[] = [];
  loading = false;
  error = '';
  selectedBook: any | null = null;
  private favoritesByExternalId = new Map<string, number>();

  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  search() {
    const q = this.query.trim();
    if (!q) return;

    this.loading = true;
    this.error = '';
    this.results = [];

    this.booksService.searchBooks(q).subscribe({
      next: (data) => {
        this.results = data;
        this.syncFavoritesFlag();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error buscando libros.';
        this.loading = false;
      },
    });
  }

  openModal(book: any) {
    this.selectedBook = book;
  }

  closeModal() {
    this.selectedBook = null;
  }

  toggleFavorite(book: any) {
    if (book._isFavorite) {
      const favoriteId = book._favoriteId ?? this.favoritesByExternalId.get(book.externalId);
      if (!favoriteId) {
        return;
      }

      this.booksService.deleteFavorite(favoriteId).subscribe({
        next: () => {
          book._isFavorite = false;
          book._favoriteId = null;
          this.favoritesByExternalId.delete(book.externalId);
        },
        error: (err) => {
          console.error('ERROR al eliminar:', err);
        },
      });
      return;
    }

    this.booksService
      .addFavorite({
        externalId: book.externalId,
        title: book.title,
        authors: book.authors,
        firstPublishYear: book.firstPublishYear,
        coverUrl: book.coverUrl,
      })
      .subscribe({
        next: (data) => {
          book._isFavorite = true;
          book._favoriteId = data?.id ?? null;
          if (book._favoriteId) {
            this.favoritesByExternalId.set(book.externalId, book._favoriteId);
          } else {
            this.loadFavorites();
          }
        },
        error: (err) => {
          console.error('ERROR al agregar:', err);
        },
      });
  }

  getCoverUrl(coverUrl: string | null | undefined) {
    if (!coverUrl || coverUrl === 'null' || coverUrl === 'undefined') {
      return this.coverFallback;
    }
    return coverUrl;
  }

  formatDescription(description: string | null | undefined) {
    if (!description) return '';

    const refs = new Map<string, string>();
    const lines = description.split(/\r?\n/);
    const kept: string[] = [];
    const refRegex = /^\s*\[(\d+)\]:\s*(\S+)\s*$/;

    for (const line of lines) {
      const match = line.match(refRegex);
      if (match) {
        refs.set(match[1], match[2]);
      } else {
        kept.push(line);
      }
    }

    let text = kept.join(' ').replace(/\s+/g, ' ').trim();
    text = text.replace(/\s*-{6,}\s*/g, '<br>');
    text = this.escapeHtml(text);

    text = text.replace(/\[([^\]]+)\]\[(\d+)\]/g, (_match, label, id) => {
      const url = refs.get(id);
      if (!url || !/^https?:\/\//i.test(url)) {
        return label;
      }
      return `<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });

    text = text.replace(/\[(\d+)\]/g, (match, id) => {
      const url = refs.get(id);
      if (!url || !/^https?:\/\//i.test(url)) {
        return match;
      }
      return `<a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer">[${id}]</a>`;
    });

    return text;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private loadFavorites() {
    this.booksService.getFavorites().subscribe({
      next: (favorites) => {
        this.favoritesByExternalId = new Map(
          favorites.map((favorite) => [favorite.externalId, favorite.id])
        );
        this.syncFavoritesFlag();
      },
      error: (err) => {
        console.error('ERROR al cargar favoritos:', err);
      },
    });
  }

  private syncFavoritesFlag() {
    this.results = this.results.map((book) => {
      const favoriteId = this.favoritesByExternalId.get(book.externalId);
      book._isFavorite = Boolean(favoriteId);
      book._favoriteId = favoriteId ?? null;
      return book;
    });
  }
}
