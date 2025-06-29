This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Multi-Model Chat Interface**: Chat with multiple AI models simultaneously
- **OpenRouter Integration**: Real AI responses using OpenRouter API
- **Chat History**: Contextual conversations with full message history
- **User Authentication**: Secure user management with Supabase
- **Responsive Design**: Modern UI with shadcn/ui components

## Getting Started

### Prerequisites

1. **OpenRouter API Key**: Get your API key from [OpenRouter](https://openrouter.ai/)
2. **Supabase Setup**: Configure your Supabase project for authentication and database

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site Configuration (optional, for OpenRouter rankings)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Chat Playground

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Chat History Management

The application now includes intelligent chat history management:

- **Per-Model History**: Each AI model maintains its own conversation history
- **Automatic Cleanup**: Histories are automatically cleaned up when models are no longer active
- **Contextual Responses**: AI models receive full conversation context for coherent responses
- **Global State Management**: Uses Jotai atoms for efficient state management

## API Endpoints

- `POST /api/chat/create-conversation` - Create a new conversation
- `GET /api/chat/get-conversations` - Get user's conversations
- `POST /api/chat/send-prompt` - Send a prompt to multiple models
- `GET /api/chat/get-messages` - Get conversation messages
- `GET /api/chat/get-models` - Get available AI models

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
