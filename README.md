# CCA Migration Generator

A robust TypeORM migration and table schema generator for PostgreSQL with TypeScript support.

## Overview

`cca-migration-generator` is a CLI tool that streamlines the creation of TypeORM migrations and table schemas for PostgreSQL databases. It offers seamless TypeScript integration and automated migration file generation.

## Prerequisites

- Node.js >= 14
- PostgreSQL >= 12
- TypeORM >= 0.3.0
- TypeScript >= 4.5

## Usage

### Basic Commands

Generate a new migration:

```bash
npx cca-migration-generator CreateUserTable
```

## Getting Started

### 1. Database Configuration

Create a `cca.config.json` file in your project root:

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "username",
  "password": "your_password",
  "database": "your_database"
}
```

### 2. Environment Setup

Create a `.env` file with your database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
NODE_ENV=development
```

### 3. Project Structure

Recommended project structure:

```
your-project/
├── src/
|   ├── infrastructure/
|   │   ├── database/
|   │   │   ├── migrations/
|   │   │   │   └── [migration files]
|   │   │   └── config.ts
|   │   └── entities/
|   │       └── [entity files]
├── cca.config.json
└── .env
```

### 4. DataSource Configuration

Create a `config.ts` file for TypeORM configuration:

```typescript
// src/database/config.ts
export const dataSourceConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    // List your entity classes here
  ],
  migrations: [
    // Path to your migrations folder
  ],
  synchronize: false, // Enable only in development
  logging: true,
};
```

## Features

- Automated TypeORM migration file generation
- PostgreSQL schema management
- TypeScript support with type definitions
- Flexible configuration options
- Custom migration templates
- Support for complex database relationships
- Automatic timestamp handling

## Error Handling

### Common Issues and Solutions

#### Configuration Errors
- **Config file not found**: Ensure `cca.config.json` exists in your project root
- **Invalid configuration**: Verify database credentials in `cca.config.json` or `.env`
- **Connection failed**: Check PostgreSQL server status and accessibility

#### Migration Errors
- **Duplicate migration**: Each migration name must be unique
- **Invalid migration path**: Verify migration directory configuration
- **Syntax error**: Ensure TypeScript syntax is correct in migration files

## Best Practices

### Migration Management
- Keep migrations atomic and focused
- Use meaningful, descriptive migration names
- Test migrations in development before deploying to production
- Never modify existing migrations
- Use transactions for complex migrations

### Configuration
- Store sensitive data in environment variables
- Maintain separate configurations for development and production
- Document configuration changes

### Type Safety
- Define TypeScript interfaces for entities
- Use appropriate column types
- Implement enums for predefined values

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## Support

- Report issues: [GitHub Issues](https://github.com/MindaugasBaltrunas/cca-migration-generator/issues)
- Read docs: [Wiki](https://github.com/MindaugasBaltrunas/cca-migration-generator/wiki)
- Join discussions: [Community](https://github.com/MindaugasBaltrunas/cca-migration-generator/discussions)

## License

This project is licensed under the MIT License - see the LICENSE file for details.