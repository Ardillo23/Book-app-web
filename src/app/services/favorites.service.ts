import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateFavoriteDto {
  externalId: string;
  title: string;
  authors: string;
  firstPublishYear?: number | null;
  coverUrl?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private baseUrl = 'https://localhost:7094/api/Favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addFavorite(dto: CreateFavoriteDto): Observable<any> {
    return this.http.post<any>(this.baseUrl, dto);
  }

  deleteFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
