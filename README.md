## invee

**invee** will be a fully featured invoice management app. It's currently in an MVP state.

### Features

- Create new invoices, optionally as drafts
- View core on the dashboard, currently: breakdown of invoice status and revenue charts
- View invoices and their status in an outbox
- View individual invoices, change their status or edit them if they're drafts

### Planned Features

- Multi-currency support (currently USD only)
- Multi-language support (currently English only, German is planned)
- Fine-grained sorting of invoices in outbox
- Mailing service to actually send out invoices to payees
- Projects: Assign and organize invoices to projects
- Various quality-of-life basics: Forgot Password flow, tooltips, alerts, toasts
- Also see [Issues](https://github.com/nrademacher/invee/issues)

### Contributing

This project is still in early development and hence volatile, but pull requests are welcome.

#### Requirements
- Node.js v14+
- Yarn package manager
- Docker (for running a Postgres instance for local development)

1. Either pick an existing issue (preferred) or create a new one
1. Fork this repo and clone it locally
1. Install dependencies with `yarn`
1. Copy the requisite env file from the example: `cp .env.example .env`
1. Set up and start the database and dev server with `yarn dx` (or simply `yarn dev` if DB is already up and running)
1. Create a user by running `yarn prisma studio`, clicking the User tab, and adding a user entry with credentials
 - Use [Bcrypt generator](https://bcrypt-generator.com/) to create a hashed password
1. Make changes, then create a pull request that references the issue you picked in Step 1
1. Submit your pull request for review

