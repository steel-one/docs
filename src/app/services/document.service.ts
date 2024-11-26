import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { DOCUMENTS, IDocument } from '../models/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor() {}

  public getDocuments(): Observable<IDocument[]> {
    const mockDocument: IDocument[] = DOCUMENTS;
    return of(mockDocument);
  }

  public getDocumentById(id: string): Observable<IDocument | null> {
    return this.getDocuments().pipe(
      map((documents: IDocument[]) => documents.find((doc) => doc.id === id) || null)
    );
  }
}
