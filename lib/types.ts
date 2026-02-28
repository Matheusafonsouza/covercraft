export interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  body: string;
}

export interface CardData extends FormData {
  logoSrc: string | null;
}

export interface CardDimensions {
  cardW: number;
  cardH: number;
}

export interface LogoDimensions {
  logoW: number;
  logoH: number;
}
