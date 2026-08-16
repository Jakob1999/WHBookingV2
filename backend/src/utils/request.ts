import { Request } from "express";

export interface RequestWithId extends Request {
    id? : number
}

export interface RequestWithImageKey extends Request {
    key? : String
}