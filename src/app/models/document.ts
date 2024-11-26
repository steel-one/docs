export const DOCUMENTS: IDocument[] = [
  {
    id: '9de3b439-9c3e-42a6-86cd-a9eefeecd6f2',
    name: 'test doc',
    pages: [
      { number: 1, imageUrl: 'assets/1.png' },
      { number: 2, imageUrl: 'assets/2.png' },
      { number: 3, imageUrl: 'assets/3.png' },
      { number: 4, imageUrl: 'assets/4.png' },
      { number: 5, imageUrl: 'assets/5.png' },
    ],
    annotations: [],
  },
  {
    id: '54d0c022-4d17-4851-8c27-e41b96397eac',
    name: 'test doc 2',
    pages: [{ number: 5, imageUrl: 'assets/5.png' }],
    annotations: [],
  },
];

export interface IPage {
  number: number;
  imageUrl: string;
}

export interface IAnnotation {
  id: string;
  type: 'text' | 'image';
  content: string;
  top: number;
  left: number;
  editing?: boolean;
}

export interface IDocument {
  id: string;
  name: string;
  pages: IPage[];
  annotations: IAnnotation[];
}
