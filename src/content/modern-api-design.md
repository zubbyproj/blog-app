---
title: "Modern API Design: REST and GraphQL"
date: "2024-02-13"
excerpt: "Learn how to design and implement modern APIs using REST and GraphQL"
imageUrl: "/images/api-design.jpg"
---

# Modern API Design: REST and GraphQL

Modern applications require well-designed APIs. Let's explore best practices for both REST and GraphQL APIs.

## RESTful API Design

### Resource Naming

Use clear, noun-based resource names:

```text
# Good
GET /articles
GET /articles/123
GET /articles/123/comments

# Bad
GET /getArticles
GET /article_by_id/123
GET /articles/123/get-comments
```

### HTTP Methods

Use HTTP methods appropriately:

```javascript
// Express.js example
const router = express.Router();

// Create
router.post('/articles', async (req, res) => {
  const article = await Article.create(req.body);
  res.status(201).json(article);
});

// Read
router.get('/articles/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

// Update
router.put('/articles/:id', async (req, res) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(article);
});

// Delete
router.delete('/articles/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
```

### Status Codes

Use appropriate status codes:

```javascript
function handleResponse(res, data, statusCode = 200) {
  const successCodes = {
    GET: 200,
    POST: 201,
    PUT: 200,
    DELETE: 204
  };

  const errorResponses = {
    400: { error: 'Bad Request' },
    401: { error: 'Unauthorized' },
    403: { error: 'Forbidden' },
    404: { error: 'Not Found' },
    500: { error: 'Internal Server Error' }
  };

  if (statusCode >= 400) {
    return res.status(statusCode).json(errorResponses[statusCode]);
  }

  if (statusCode === 204) {
    return res.status(204).end();
  }

  return res.status(statusCode).json(data);
}
```

## GraphQL API Design

### Schema Design

Define clear, purposeful types:

```graphql
type Article {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  createdAt: DateTime!
  updatedAt: DateTime
}

type User {
  id: ID!
  name: String!
  email: String!
  articles: [Article!]!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  article: Article!
  createdAt: DateTime!
}

type Query {
  article(id: ID!): Article
  articles(
    offset: Int
    limit: Int
    sortBy: ArticleSortField
  ): [Article!]!
}

type Mutation {
  createArticle(input: CreateArticleInput!): Article!
  updateArticle(id: ID!, input: UpdateArticleInput!): Article!
  deleteArticle(id: ID!): Boolean!
}
```

### Resolvers

Implement efficient resolvers:

```javascript
const resolvers = {
  Query: {
    article: async (_, { id }, { dataSources }) => {
      return dataSources.articles.findById(id);
    },
    articles: async (_, { offset, limit, sortBy }, { dataSources }) => {
      return dataSources.articles.findAll({ offset, limit, sortBy });
    }
  },

  Article: {
    author: async (article, _, { dataSources }) => {
      return dataSources.users.findById(article.authorId);
    },
    comments: async (article, _, { dataSources }) => {
      return dataSources.comments.findByArticleId(article.id);
    }
  }
};
```

### Error Handling

Handle errors gracefully:

```javascript
const errorHandler = {
  formatError: (error) => {
    console.error(error);
    
    if (error.originalError instanceof AuthenticationError) {
      return {
        message: 'Not authenticated',
        code: 'UNAUTHENTICATED',
        status: 401
      };
    }

    if (error.originalError instanceof ValidationError) {
      return {
        message: error.message,
        code: 'VALIDATION_ERROR',
        status: 400,
        details: error.validationErrors
      };
    }

    return {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      status: 500
    };
  }
};
```

## API Security

Implement proper security measures:

```javascript
// Authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token'
    });
  }
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

## Best Practices

1. **Documentation**
   - Use OpenAPI/Swagger for REST
   - Implement GraphQL Playground
   - Provide clear examples

2. **Versioning**
   - Use URL versioning for REST
   - Use schema versioning for GraphQL

3. **Performance**
   - Implement caching
   - Use pagination
   - Optimize queries

## Conclusion

Whether you choose REST or GraphQL, following these best practices will help you create APIs that are maintainable, performant, and developer-friendly. 