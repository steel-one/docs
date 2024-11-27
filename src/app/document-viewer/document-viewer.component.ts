import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, Location, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { IAnnotation, IDocument } from '../models/document';
import { DocumentService } from '../services/document.service';

const DEFAULT_ZOOM_LEVEL = 10;

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class DocumentViewerComponent implements OnInit {
  document: IDocument | null = null;
  zoomLevel = DEFAULT_ZOOM_LEVEL;
  zoomStyle = `scale(${this.zoomLevel})`;
  maxZoom = 25;
  minZoom = 0.5;
  annotationForms: { [key: string]: FormGroup } = {};
  selectedImage: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private documentService: DocumentService,
    private ngZone: NgZone,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const docId = this.route.snapshot.paramMap.get('id') || '';
    this.documentService.getDocumentById(docId).subscribe((doc) => {
      this.document = doc;
      this.initializeAnnotationForms();
    });
    const savedZoom = localStorage.getItem('zoomLevel');
    if (savedZoom) {
      this.zoomLevel = parseFloat(savedZoom);
      this.updateZoomStyle();
    }
  }

  initializeAnnotationForms(): void {
    if (this.document && this.document.annotations) {
      this.document.annotations.forEach((annotation) => {
        this.annotationForms[annotation.id] = this.fb.group({
          content: [annotation.content, Validators.required],
        });
      });
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
      editing: false,
    };
    this.document!.annotations = [...this.document!.annotations!, annotation];
    this.annotationForms[annotation.id] = this.fb.group({
      content: [annotation.content, Validators.required],
    });
  }

  removeAnnotation(annotation: IAnnotation): void {
    const index = this.document!.annotations!.indexOf(annotation);
    if (index > -1) {
      this.document!.annotations!.splice(index, 1);
      delete this.annotationForms[annotation.id];
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

  editAnnotation(annotation: IAnnotation): void {
    annotation.editing = true;
    const form = this.annotationForms[annotation.id];
    if (form) {
      form.setValue({ content: annotation.content });
    }
  }

  stopEditing(annotation: IAnnotation): void {
    const form = this.annotationForms[annotation.id];
    if (form && form.valid) {
      annotation.content = form.value.content;
      annotation.editing = false;
    }
  }

  addImageAnnotation(): void {
    if (this.selectedImage) {
      const annotation: IAnnotation = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'image',
        content: this.selectedImage as string,
        top: 100,
        left: 100,
      };
      this.document!.annotations.push(annotation);
      this.selectedImage = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.selectedImage = e.target.result;
          this.addImageAnnotation();
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}
