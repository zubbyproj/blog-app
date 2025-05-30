---
title: "Node.js Backend Development"
date: "2024-02-06"
excerpt: "Learn how to build scalable and maintainable backend applications with Node.js"
imageUrl: "/images/nodejs.jpg"
---

# Node.js Backend Development

Build robust and scalable backend applications with Node.js. Let's explore best practices and patterns.

## Project Structure

Organize your Node.js application:

```typescript
// Project structure
src/
  ├── config/           # Configuration files
  │   ├── database.ts
  │   └── env.ts
  ├── controllers/      # Route controllers
  │   └── userController.ts
  ├── models/          # Database models
  │   └── User.ts
  ├── routes/          # Route definitions
  │   └── userRoutes.ts
  ├── services/        # Business logic
  │   └── userService.ts
  ├── middleware/      # Custom middleware
  │   └── auth.ts
  ├── utils/           # Utility functions
  │   └── logger.ts
  └── app.ts          # Application entry point
```

## Express Setup

Configure Express application:

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import { userRoutes } from './routes/userRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

export default app;
```

## Environment Configuration

Manage environment variables:

```typescript
// src/config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

export default env;
```

## Database Integration

Set up database connection with TypeORM:

```typescript
// src/config/database.ts
import { DataSource } from 'typeorm';
import env from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

## Models

Define database models:

```typescript
// src/models/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
```

## Controllers

Implement route controllers:

```typescript
// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AppError } from '../utils/appError';

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response) {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  }

  async getById(req: Request, res: Response) {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json(user);
  }

  async update(req: Request, res: Response) {
    const user = await this.userService.updateUser(
      req.params.id,
      req.body
    );
    res.json(user);
  }

  async delete(req: Request, res: Response) {
    await this.userService.deleteUser(req.params.id);
    res.status(204).end();
  }
}
```

## Services

Implement business logic:

```typescript
// src/services/userService.ts
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import { CreateUserDto, UpdateUserDto } from '../dtos/user';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new AppError('User not found', 404);
    }
  }
}
```

## Middleware

Create custom middleware:

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import env from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    status: 'error',
    message: env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
};

// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { AppError } from '../utils/appError';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};
```

## Caching

Implement Redis caching:

```typescript
// src/services/cacheService.ts
import Redis from 'ioredis';
import env from '../config/env';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      await this.redis.set(key, JSON.stringify(value));
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
```

## Background Jobs

Handle background tasks:

```typescript
// src/jobs/emailQueue.ts
import Bull from 'bull';
import env from '../config/env';
import { EmailService } from '../services/emailService';

interface EmailJob {
  to: string;
  subject: string;
  html: string;
}

export const emailQueue = new Bull<EmailJob>('email', env.REDIS_URL);

emailQueue.process(async (job) => {
  const emailService = new EmailService();
  await emailService.send(job.data);
});

// Add job to queue
export const scheduleEmail = async (data: EmailJob) => {
  await emailQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
};
```

## Testing

Write tests for your application:

```typescript
// src/__tests__/user.test.ts
import request from 'supertest';
import { AppDataSource } from '../config/database';
import app from '../app';
import { User } from '../models/User';

describe('User API', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    await AppDataSource.getRepository(User).clear();
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });
});
```

## API Documentation

Generate API documentation:

```typescript
// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
export const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/', userController.create);
```

## Conclusion

Building a Node.js backend requires careful consideration of architecture, security, and performance. By following these patterns and best practices, you can create maintainable and scalable applications. 