import { IsUrl, IsBase64, IsNotEmpty } from 'class-validator';

export class FromUrlDto {
  @IsNotEmpty()
  @IsUrl()
  public url: string;
}

export class FromBase64ContentDto {
  @IsNotEmpty()
  //@IsBase64()
  public content: string;
}
