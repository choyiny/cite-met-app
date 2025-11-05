# cite-met-app Starter
A starter template for building cite-met-app applications using Cloudflare Workers and Lovable.


## Installation

1. Clone the repository with submodules:
```bash
git clone --recursive git@github.com:choyiny/cite-met-app.git
```

2. Navigate to the project directory and install dependencies:
```bash
cd cite-met-app
yarn install
```

3. Run migrations and build frontend
```bash
yarn build:frontend:dev
yarn db:migrate:dev
```

4. Copy the example environment variables file and update it with your own values:
```bash
cp .dev.vars.bkp .dev.vars
```

5. Start the development server:
```bash
yarn dev
```

## Deployment
To deploy your application, use the following command and follow wrangler instructions:

```bash
yarn build:frontend && yarn deploy
```

## Common Commands
[For synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```bash
yarn cf-typegen
```

For generating database migrations
```bash
yarn db:migrate:dev
```
