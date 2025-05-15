import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
  role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}
