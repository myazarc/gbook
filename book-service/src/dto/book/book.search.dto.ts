import { IsNotEmpty, IsNumberString, IsOptional, IsPositive, IsString, Max, MaxLength, MinLength } from "class-validator";

export class BookSearchDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  author: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  publisher: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  isbn: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  keywords: string;

  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  maxResults: number;
}
