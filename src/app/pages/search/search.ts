import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { BooksService } from '../../services/books.service';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  query = '';
  results: any[] = [];
  loading = false;
  error = '';

  constructor(  
  private booksService: BooksService,
  private favoritesService: FavoritesService
) {}

  search() {
    const q = this.query.trim();
    if (!q) return;

    this.loading = true;
    this.error = '';
    this.results = [];

    this.booksService.searchBooks(q).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error buscando libros.';
        this.loading = false;
      }
    });
  }
addToFavorites(book: any) {
  console.log('CLICK addToFavorites', book);

  this.booksService.addFavorite({
    externalId: book.externalId,
    title: book.title,
    authors: book.authors,
    firstPublishYear: book.firstPublishYear,
    coverUrl: book.coverUrl,
  }).subscribe({
    next: (data) => {
      console.log('OK agregado:', data);
      book._isFavorite = true; // así se deshabilita el botón
      alert('Agregado ✅');
    },
    error: (err) => {
      console.error('ERROR al agregar:', err);
      alert('No se pudo agregar ❌');
    },
  });
}








}