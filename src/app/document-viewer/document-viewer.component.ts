import { Location, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService, IDocument } from '../services/document.service';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class DocumentViewerComponent implements OnInit {
  document: IDocument | null = null;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const docId = this.route.snapshot.paramMap.get('id') || '';
    this.documentService.getDocumentById(docId).subscribe((doc) => {
      this.document = doc;
    });
  }

  goBack(): void {
    this.location.back();
  }
}
