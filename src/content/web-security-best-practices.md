---
title: "Web Security Best Practices"
date: "2024-02-07"
excerpt: "Learn essential security practices to protect your web applications from common vulnerabilities"
imageUrl: "/images/web-security.jpg"
---

# Web Security Best Practices

Security is crucial for modern web applications. Let's explore essential security practices and implementations.

## Authentication

Implement secure user authentication:

```typescript
// utils/auth.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
  password: string;
}

export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_EXPIRES_IN = '24h';

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.JWT_SECRET);
  }
}
```

## Input Validation

Sanitize and validate user input:

```typescript
// middleware/validator.ts
import { body, validationResult } from 'express-validator';
import xss from 'xss';

export const userValidationRules = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .trim(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2 })
];

export const sanitizeInput = (input: string): string => {
  return xss(input.trim());
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

## CSRF Protection

Implement CSRF tokens:

```typescript
// middleware/csrf.ts
import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

const csrfProtection = csrf({ cookie: true });

export const setupCSRF = (app: Express) => {
  app.use(csrfProtection);
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });
};

// React component using CSRF token
function Form() {
  return (
    <form method="POST" action="/api/submit">
      <input
        type="hidden"
        name="_csrf"
        value={document.cookie.match(/XSRF-TOKEN=(.*)/)?.[1]}
      />
      {/* Form fields */}
    </form>
  );
}
```

## XSS Prevention

Prevent Cross-Site Scripting:

```typescript
// components/SafeHtml.tsx
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface SafeHtmlProps {
  content: string;
  allowMarkdown?: boolean;
}

export function SafeHtml({ content, allowMarkdown = false }: SafeHtmlProps) {
  const sanitizeConfig = {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  };

  const sanitize = (html: string) => {
    return DOMPurify.sanitize(html, sanitizeConfig);
  };

  const renderContent = () => {
    if (allowMarkdown) {
      const html = marked(content);
      return sanitize(html);
    }
    return sanitize(content);
  };

  return (
    <div dangerouslySetInnerHTML={{ __html: renderContent() }} />
  );
}
```

## SQL Injection Prevention

Use parameterized queries:

```typescript
// database/queries.ts
import { Pool } from 'pg';

export class UserRepository {
  constructor(private pool: Pool) {}

  async findUserById(id: string) {
    // Good: Parameterized query
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  // Bad: Don't do this!
  async unsafeFindUser(id: string) {
    // Vulnerable to SQL injection
    const query = `SELECT * FROM users WHERE id = '${id}'`;
    const result = await this.pool.query(query);
    return result.rows[0];
  }
}
```

## Rate Limiting

Implement rate limiting:

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
});

export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100 // limit each IP to 100 requests per windowMs
) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rate-limit:',
    }),
    windowMs,
    max,
    message: {
      error: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
```

## Security Headers

Configure security headers:

```typescript
// middleware/security.ts
import helmet from 'helmet';
import { Express } from 'express';

export const configureSecurityHeaders = (app: Express) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https://api.example.com'],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-origin' },
      dnsPrefetchControl: true,
      frameguard: { action: 'deny' },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    })
  );
};
```

## File Upload Security

Secure file uploads:

```typescript
// middleware/fileUpload.ts
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${randomName}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    cb(new Error('Invalid file type'), false);
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
```

## Password Reset Security

Implement secure password reset:

```typescript
// services/passwordReset.ts
import crypto from 'crypto';
import { Redis } from 'ioredis';

export class PasswordResetService {
  constructor(
    private redis: Redis,
    private emailService: EmailService
  ) {}

  async createResetToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = 3600; // 1 hour

    await this.redis.set(
      `reset:${token}`,
      email,
      'EX',
      expiry
    );

    return token;
  }

  async verifyResetToken(token: string): Promise<string | null> {
    const email = await this.redis.get(`reset:${token}`);
    if (!email) return null;

    await this.redis.del(`reset:${token}`);
    return email;
  }

  async sendResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `https://example.com/reset-password?token=${token}`;
    
    await this.emailService.send({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }
}
```

## Best Practices

1. **Authentication & Authorization**
   - Use secure session management
   - Implement MFA
   - Follow the principle of least privilege

2. **Data Protection**
   - Encrypt sensitive data
   - Use HTTPS everywhere
   - Implement proper access controls

3. **Error Handling**
   - Don't expose sensitive information
   - Log securely
   - Use custom error pages

## Security Monitoring

Implement security monitoring:

```typescript
// monitoring/security.ts
import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

export const securityLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.headers['user-agent'],
    referrer: req.headers.referer || '',
  };

  logger.info('Security Log', logData);
  next();
};
```

## Conclusion

Web security is an ongoing process that requires constant vigilance. By implementing these security measures and following best practices, you can significantly reduce the risk of security breaches in your web applications. 