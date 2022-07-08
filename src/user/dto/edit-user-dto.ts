import { IsOptional, IsString } from "class-validator";

export class EditUserDto {

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

}
