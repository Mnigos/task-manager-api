export interface CreateUserDto {
  readonly _id?: string;
  readonly name: string;
  readonly pass: string;
  readonly createdAt: Date;
}
