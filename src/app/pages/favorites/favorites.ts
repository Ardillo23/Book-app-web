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
