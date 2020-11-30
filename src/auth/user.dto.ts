import { IsBoolean, IsOptional, IsString } from 'class-validator';

class UserDto {
    @IsString()
    public username!: string;

    @IsString()
    public password!: string;

    @IsBoolean()
    @IsOptional()
    public admin!: boolean;
}

export default UserDto;