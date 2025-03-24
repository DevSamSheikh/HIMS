import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
  })
  password: string;
}
