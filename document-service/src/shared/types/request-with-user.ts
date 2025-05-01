import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    sub: string;         // l’ID utilisateur dans votre token
    iat: number;
    exp: number;
    // … ajoutez ici d’autres champs si besoin
  };
}