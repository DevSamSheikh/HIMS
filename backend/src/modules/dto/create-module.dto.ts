import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

class ModuleFeatureDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  included: boolean;
}

export class CreateModuleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleFeatureDto)
  features: ModuleFeatureDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
