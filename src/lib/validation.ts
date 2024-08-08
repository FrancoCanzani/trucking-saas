import { z } from 'zod';

export const HealthCheckQuerySchema = z.object({
    url: z.string().url(),
    timeout: z.string().optional()
  });
  
  
export const HealthCheckResponseSchema = z.object({
    status: z.number(),
    responseTime: z.number(),
    date: z.string().optional()
  });