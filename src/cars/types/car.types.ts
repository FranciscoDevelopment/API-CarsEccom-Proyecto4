export type carRowT = {
  id : number ;

  brand : string ;
  
  model_name : string ;

  version_name : string ;
  
  color : string ;

  gear_count : number ;
  
  seats : number ;
  
  engine : string ;

  year : number;
  
  image_url : string | null | void ;
  
  r8_locality : string ;
  
  created_at? : Date | null ;

}


export type createCarInputI = Pick<carRowT, 'brand' | 'model_name' | 'version_name' | 'gear_count' | 'seats' | 'year' | 'engine' | 'color' | 'r8_locality' > 
& {
  image_url? : string;
}

export type carT = Omit< carRowT, "created_at" | "image_url" > & {

  image_url? : string

}
