export interface BookRequestDTO {
  title: string;
  author: string;
  isbn?: string; 
  quantity?: number; 
}

export interface BookResponseDTO {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  quantity: number;
}