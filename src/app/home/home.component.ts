import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DocumentService, IDocument } from '../services/document.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatButtonModule, MatIconModule, MatListModule],
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
