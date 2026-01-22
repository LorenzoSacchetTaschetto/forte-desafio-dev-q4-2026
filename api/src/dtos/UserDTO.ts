export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
}