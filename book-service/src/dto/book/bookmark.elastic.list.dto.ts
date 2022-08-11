import { IsNumberString, IsOptional, IsString, Max } from "class-validator";

export class BookmarkElasticListDto {
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  author: string;
  @IsString()
  @IsOptional()
  keywords: string;
}
