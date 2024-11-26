import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, Location, NgIf } from '@angular/common';
import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { IAnnotation, IDocument } from '../models/document';
import { DocumentService } from '../services/document.service';

const DEFAULT_ZOOM_LEVEL = 10;

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  standalone: true,
  imports: [NgIf, MatIconModule, MatButtonModule, CommonModule, DragDropModule],
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
    private documentService: DocumentService,
    private ngZone: NgZone
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
    this.ngZone.run(() => {
      if (this.zoomLevel < this.maxZoom) {
        this.zoomLevel += 0.3;
        this.updateZoomStyle();
      }
    });
  }

  zoomOut(): void {
    this.ngZone.run(() => {
      if (this.zoomLevel > this.minZoom) {
        this.zoomLevel -= 0.3;
        this.updateZoomStyle();
      }
    });
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
    if (event.key === '+') {
      this.zoomIn();
    } else if (event.shiftKey && event.key === '-') {
      this.zoomOut();
    } else if (event.shiftKey && event.key === '0') {
      this.resetZoom();
    }
  }

  addTextAnnotation(): void {
    const annotation: IAnnotation = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      content: 'New Annotation',
      top: 250,
      left: -315,
    };
    this.document!.annotations = [...this.document!.annotations!, annotation];
  }

  addImageAnnotation(): void {
    const annotation: IAnnotation = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'image',
      content: 'src/assets/annotation-example.png',
      top: 250,
      left: -315,
    };
    this.document!.annotations = [...this.document!.annotations!, annotation];
  }

  removeAnnotation(annotation: IAnnotation): void {
    const index = this.document!.annotations!.indexOf(annotation);
    if (index > -1) {
      this.document!.annotations!.splice(index, 1);
    }
  }

  saveAnnotations(): void {
    console.log('Document:', this.document);
    console.log('Annotations:', this.document!.annotations);
  }

  onAnnotationDragEnd(annotation: any, event: CdkDragEnd) {
    const { x, y } = event.source.getFreeDragPosition();
    annotation.top = y;
    annotation.left = x;
  }
}
