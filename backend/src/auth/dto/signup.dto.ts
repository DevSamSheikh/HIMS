import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  Matches,
} from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
  })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  facilityName: string;

  @IsNotEmpty()
  @IsString()
  facilityType: string;

  @IsOptional()
  @IsArray()
  selectedModules?: string[];

  @IsOptional()
  @IsString()
  promoCode?: string;
}
