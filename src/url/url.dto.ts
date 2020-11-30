import { IsAlphanumeric, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

class UrlDto {
    @IsUrl()
    public fullUrl!: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    @IsAlphanumeric()
    public shortUrl!: string;
}

export default UrlDto;