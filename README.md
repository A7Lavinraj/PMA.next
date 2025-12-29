# PMA - Parking Management Application

An Interview assignment, to might get a job!

## Local setup

Spin up a local postgres database

```sh
docker compose up
```

Install dependencies

```sh
pnpm install
```

Run migrations

```sh
pnpm run db:migrate
```

Seed database

```sh
pnpm run db:seed
```

Run dev server

```sh
pnpm run dev
```

Visit [https://localhost:3000](https://localhost:3000)
