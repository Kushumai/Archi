import { Request } from 'express'

export interface ServiceRequest extends Request {
  service?: string
}