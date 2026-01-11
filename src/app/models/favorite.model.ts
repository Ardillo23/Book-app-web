export interface Favorite {
  id: number;
  userId: number;
  externalId: string;
  title: string;
  authors: string;
  firstPublishYear?: number | null;
  coverUrl?: string | null;
}
