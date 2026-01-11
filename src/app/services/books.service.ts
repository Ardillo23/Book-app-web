import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

    private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // 🔎 Buscar libros (backend → OpenLibrary)
  searchBooks(query: string) {
  return this.http.get<any[]>(`${this.apiUrl}/books/search`, {
    params: { query }
  });
}

  // ⭐ Obtener favoritos
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favorites`);
  }

  // ➕ Agregar favorito
  addFavorite(favorite: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites`, favorite);
  }

  // ❌ Eliminar favorito
  deleteFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorites/${id}`);
  }
}
