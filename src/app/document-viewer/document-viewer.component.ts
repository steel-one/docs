import { Location, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { DocumentService, IDocument } from '../services/document.service';

const DEFAULT_ZOOM_LEVEL = 10;

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  standalone: true,
  imports: [NgIf, MatIconModule, MatButtonModule],
})
export class DocumentViewerComponent implements OnInit {
  document: IDocument | null = null;
  zoomLevel = DEFAULT_ZOOM_LEVEL;
  zoomStyle = `scale(${this.zoomLevel})`;
  maxZoom = 25;
  minZoom = 0.5;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    const docId = this.route.snapshot.paramMap.get('id') || '';
    this.documentService.getDocumentById(docId).subscribe((doc) => {
      this.document = doc;
    });
    const savedZoom = localStorage.getItem('zoomLevel');
    if (savedZoom) {
      this.zoomLevel = parseFloat(savedZoom);
      this.updateZoomStyle();
    }
  }

  goBack(): void {
    this.location.back();
  }

  zoomIn(): void {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel += 0.3;
      this.updateZoomStyle();
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel -= 0.3;
      this.updateZoomStyle();
    }
  }

  resetZoom(): void {
    this.zoomLevel = DEFAULT_ZOOM_LEVEL;
    this.updateZoomStyle();
  }

  private updateZoomStyle(): void {
    this.zoomStyle = `scale(${this.zoomLevel})`;
    localStorage.setItem('zoomLevel', this.zoomLevel.toString());
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    console.log('Key pressed:', event.key);

    if (event.key === '+') {
      this.zoomIn();
    } else if (event.shiftKey && event.key === '-') {
      this.zoomOut();
    } else if (event.shiftKey && event.key === '0') {
      this.resetZoom();
    }
  }
}
