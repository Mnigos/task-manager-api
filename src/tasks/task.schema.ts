import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class TaskApi extends Document {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  userId: string

  @Prop({ type: String, default: () => new Date() })
  createdAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(TaskApi)
