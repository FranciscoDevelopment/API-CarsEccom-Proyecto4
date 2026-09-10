export type JwtPayloadT = {
  sub : string; // id del usuario
  email : string;
  role : string;
  iat : number;
  exp : number;
}