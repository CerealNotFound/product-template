# Chat API Endpoints

This directory contains the API routes for the Chat Playground application.

## Authentication

All endpoints require user authentication. Users can only access their own conversations and data.

## Endpoints

### 1. Create Conversation

- **POST** `/api/chat/create-conversation`
- **Auth:** Required
- **Body:** `{ "title": "string" }`
- **Response:** `{ "conversation_id": "uuid" }`
- **Notes:** Creates conversation for the authenticated user

### 2. Get Conversations

- **GET** `/api/chat/get-conversations`
- **Auth:** Required
- **Response:** `Array<{ id: string, title: string, created_at: string }>`
- **Notes:** Returns only conversations belonging to the authenticated user

### 3. Send Prompt

- **POST** `/api/chat/send-prompt`
- **Auth:** Required
- **Body:** `{ "conversation_id": "string", "content": "string", "model_ids": ["string"] }`
- **Response:** `{ "prompt_id": "string", "responses": Array<{ model_id: string, content: string }> }`
- **Notes:** Only works with conversations owned by the authenticated user

### 4. Get Messages

- **GET** `/api/chat/get-messages?conversation_id=uuid`
- **Auth:** Required
- **Response:** `Array<{ prompt: string, created_at: string, responses: Array<{ model_id: string, model_name: string, content: string, created_at: string }> }>`
- **Notes:** Only returns messages from conversations owned by the authenticated user

### 5. Get Models

- **GET** `/api/chat/get-models`
- **Auth:** Required
- **Response:** `Array<{ id: string, name: string, logo?: string }>`
- **Notes:** Returns all available AI models

## Database Schema

The API uses the following Supabase tables:

- `conversations` - Chat sessions (includes `user_id` for ownership)
- `models` - AI model metadata
- `prompts` - User inputs within conversations
- `responses` - Model replies to prompts

## Security Features

- **User Isolation:** Users can only access their own conversations
- **Authentication Required:** All endpoints require valid user session
- **Ownership Verification:** Conversation access is verified before any operations
- **Error Handling:** Proper 401/404 responses for unauthorized access

## Notes

- Currently uses dummy responses for AI models
- Future integration with OpenRouter API planned
- All endpoints return JSON responses
- Error responses include `{ error: "message" }` format
- Authentication errors return 401 status code
- Access denied errors return 404 status code
