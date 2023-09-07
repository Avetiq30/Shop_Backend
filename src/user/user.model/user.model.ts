import { prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";

export interface User extends Base {}

export class User extends TimeStamps{
   @prop()
    firstName: string;
    @prop()
    lastName: string;
    @prop({unique:true})
    email: string;
    @prop()
    password: string;
}
