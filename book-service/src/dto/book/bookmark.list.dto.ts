import { IsNumberString, IsOptional, Max } from "class-validator";

export class BookmarkListDto {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  maxResults: number;
}
