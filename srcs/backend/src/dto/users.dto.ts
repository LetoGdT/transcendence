export class CreateUserDto
{
	// @IsNotEmpty()
	// @MinLength(3)
	login: string;

	// @IsNotEmpty()
	// @IsEmail()
	email: string;

	// @IsNotEmpty()
	// @MinLength(8)
	image_url: string;
}