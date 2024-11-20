import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DocumentService, IDocument } from '../services/document.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  documents$ = new BehaviorSubject<IDocument[]>([]);

  constructor(private documentService: DocumentService) {
    this.documentService.getDocuments().subscribe((docs) => {
      this.documents$.next(docs);
    });
  }
}
