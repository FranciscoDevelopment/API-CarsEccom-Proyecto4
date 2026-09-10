import { carRowT } from "src/cars/types/car.types";

export type modelRowT = Pick< carRowT, "id" | "brand" > & {

    name : string

}