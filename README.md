# 🧱 DDD Backend Basecode

A modular, scalable backend boilerplate using **Domain-Driven Design (DDD)** principles. Built with [Bun](https://bun.sh), this basecode promotes clean architecture, separation of concerns, and layered testing for real-world backend applications.

---

## 📁 Project Structure

```
src/
├── modules/
│   └── moduleName/
│       ├── domain/           # Core domain logic: entities, value objects, domain services
│       ├── dtos/             # Input/output data shapes
│       ├── mappers/          # Map between domain, DTOs, and DB models
│       ├── repos/            # Repository interfaces and implementations
│       ├── services/         # Domain service orchestration
│       ├── subscriptions/    # Event listeners or pub/sub logic
│       └── useCases/         # Application logic (commands/queries)
│
└── shared/                   # Shared code (utils, errors, types, etc.)

tests/
├── module/
│   └── moduleName/
│       ├── e2e/              # E2E tests
│       └── features/         # Acceptance tests (Cucumber/Gherkin)
```

---

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.development
cp .env.example .env.test
```

Then edit each file with your environment-specific values.

### 3. Set Up Database

Make sure your DB is ready and matches the `.env.development` and `.env.test` settings.

### 4. Run Schema Migration

```bash
bun run drizzle-push:dev
```

---

## 🏃 Running the Project

### Development Mode

```bash
bun run start:dev
```

### Debug Mode

Use your IDE’s "Run" or "F5" with the correct Bun entry point.

---

## 🧪 Testing Guide

### Unit Tests

```bash
bun run test:unit
```

Watch mode:

```bash
bun run test:unit:dev
```

### Integration Tests

```bash
bun run test:infra
```

Watch mode:

```bash
bun run test:infra:dev
```

### E2E Tests

```bash
bun run test:e2e
```

Watch mode:

```bash
bun run test:e2e:dev
```

### Feature (Acceptance) Tests

For `.feature` files:

Install the **Cucumber (Gherkin) Full Support** VSCode extension:
[alexkrechik.cucumberautocomplete](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)

---

## 📦 Clone as New Project

To start a new project from this base:

### 1. Clone this repo

```bash
git clone https://github.com/your-username/ddd-backend-basecode.git your-new-project
```

### 2. Navigate into your new project

```bash
cd your-new-project
```

### 3. Remove existing Git history

```bash
rm -rf .git
```

### 4. Reinitialize your own Git repo

```bash
git init
git remote add origin <your-own-repo-url>
```

### 5. Install dependencies

```bash
bun install
```

You can now start customizing it for your own domain logic. Rename the initial module and configure your environment as needed.
