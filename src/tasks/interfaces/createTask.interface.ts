export interface CreateTaskDto {
  readonly _id?: string
  readonly userId: string
  readonly name: string
  readonly createdAt?: Date
}
