import { carRowT } from "src/cars/types/car.types";

export type versionRowT = Pick< carRowT, "id" | "model_name" | "version_name" | "brand" > & {

    model_id : number ;

    name : string

}