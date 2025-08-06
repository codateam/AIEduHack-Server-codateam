# AI Chat API Documentation

## API Endpoints

### 1. Send Message to AI

**Endpoint:** `POST /chat/message`

**Description:** Send a message to the AI and save the conversation history. Creates a new chat session if one doesn't exist for the course.

#### Request Body
```json
{
  "courseId": "string",        // Required: MongoDB ObjectId of the course
  "message": "string",         // Required: User's message to the AI
  "additionalInfo": "string",  // Optional: Additional context information
  "lang": "string"            // Required: Language code (e.g., "en", "es", "fr")
}
```

#### Example Request
```bash
curl -X POST http://localhost:5051/api/ai/chat/message \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "message": "Can you explain the concept of recursion in programming?",
    "additionalInfo": "I am having trouble understanding how recursive functions work",
    "lang": "en"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "response": "Recursion is a programming technique where a function calls itself to solve a problem by breaking it down into smaller, similar subproblems...",
    "chatHistory": {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
      "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "courseId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "organizationId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "messages": [
        {
          "role": "user",
          "content": "Can you explain the concept of recursion in programming?",
          "timestamp": "2024-01-15T10:30:00.000Z"
        },
        {
          "role": "assistant",
          "content": "Recursion is a programming technique where a function calls itself...",
          "timestamp": "2024-01-15T10:30:02.000Z"
        }
      ],
      "lang": "en",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:02.000Z"
    }
  }
}
```

#### Error Response (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "courseId",
      "message": "Course ID is required"
    },
    {
      "field": "message",
      "message": "Message cannot be empty"
    }
  ]
}
```

### 2. Get Chat History for Specific Course

**Endpoint:** `GET /chat/history/:courseId`

**Description:** Retrieve the chat history for a specific course.

#### URL Parameters
- `courseId` (string, required): MongoDB ObjectId of the course

#### Example Request
```bash
curl -X GET http://localhost:5051/api/ai/chat/history/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer your_jwt_token"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Chat history retrieved successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "courseId": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Introduction to Programming",
      "code": "CS101"
    },
    "organizationId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "messages": [
      {
        "role": "user",
        "content": "What is a variable?",
        "timestamp": "2024-01-15T10:00:00.000Z"
      },
      {
        "role": "assistant",
        "content": "A variable is a storage location with an associated name...",
        "timestamp": "2024-01-15T10:00:02.000Z"
      }
    ],
    "lang": "en",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:02.000Z"
  }
}
```

#### No History Response (200)
```json
{
  "success": true,
  "message": "No chat history found for this course",
  "data": null
}
```

### 3. Get All User Chat Histories

**Endpoint:** `GET /chat/histories`

**Description:** Retrieve all chat histories for the authenticated user across all courses.

#### Example Request
```bash
curl -X GET http://localhost:5051/api/ai/chat/histories \
  -H "Authorization: Bearer your_jwt_token"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Chat histories retrieved successfully",
  "data": [
    {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
      "courseId": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Introduction to Programming",
        "code": "CS101"
      },
      "messages": [
        {
          "role": "user",
          "content": "What is a variable?",
          "timestamp": "2024-01-15T10:00:00.000Z"
        }
      ],
      "lang": "en",
      "updatedAt": "2024-01-15T10:30:02.000Z"
    }
  ]
}
```

### 4. Clear Chat History for Specific Course

**Endpoint:** `DELETE /chat/history/:courseId`

**Description:** Delete the chat history for a specific course.

#### URL Parameters
- `courseId` (string, required): MongoDB ObjectId of the course

#### Example Request
```bash
curl -X DELETE http://localhost:5051/api/ai/chat/history/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer your_jwt_token"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Chat history cleared successfully"
}
```

### 5. Clear All User Chat Histories

**Endpoint:** `DELETE /chat/histories`

**Description:** Delete all chat histories for the authenticated user across all courses.

#### Example Request
```bash
curl -X DELETE http://localhost:5051/api/ai/chat/histories \
  -H "Authorization: Bearer your_jwt_token"
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "All chat histories cleared successfully"
}
```

### 6. Direct AI Teaching Agent Query

**Endpoint:** `POST /teaching-agent`

**Description:** Send a direct query to the AI Teaching Agent without saving to chat history.

#### Request Body
```json
{
  "course_id": "string",       // Required: MongoDB ObjectId of the course
  "additional_info": "string", // Required: Query or context information
  "lang": "string"            // Required: Language code
}
```

#### Example Request
```bash
curl -X POST http://localhost:5051/api/ai/teaching-agent \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "additional_info": "Explain the difference between let and var in JavaScript",
    "lang": "en"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": {
    "response": "The main differences between let and var in JavaScript are: 1. Scope: var has function scope while let has block scope..."
  }
}
```

---

## Data Models

### Message Object
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO 8601 date string
}
```

### Chat History Object
```typescript
interface ChatHistory {
  _id: string;
  userId: string;
  courseId: string | {
    _id: string;
    title: string;
    code: string;
  };
  organizationId: string;
  messages: Message[];
  lang: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
```

---

## Frontend Integration Examples

### React/TypeScript Service Class
```typescript
import axios, { AxiosResponse } from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatHistory {
  _id: string;
  userId: string;
  courseId: string | {
    _id: string;
    title: string;
    code: string;
  };
  organizationId: string;
  messages: Message[];
  lang: string;
  createdAt: string;
  updatedAt: string;
}

class AIChatService {
  private baseURL = 'http://localhost:5051/api/ai';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async sendMessage(
    courseId: string, 
    message: string, 
    lang: string = 'en',
    additionalInfo?: string
  ): Promise<{ response: string; chatHistory: ChatHistory }> {
    const response = await axios.post(`${this.baseURL}/chat/message`, {
      courseId,
      message,
      additionalInfo,
      lang
    }, { headers: this.getHeaders() });

    return response.data.data;
  }

  async getChatHistory(courseId: string): Promise<ChatHistory | null> {
    const response = await axios.get(`${this.baseURL}/chat/history/${courseId}`, {
      headers: this.getHeaders()
    });

    return response.data.data || null;
  }

  async getAllChatHistories(): Promise<ChatHistory[]> {
    const response = await axios.get(`${this.baseURL}/chat/histories`, {
      headers: this.getHeaders()
    });

    return response.data.data || [];
  }

  async clearChatHistory(courseId: string): Promise<void> {
    await axios.delete(`${this.baseURL}/chat/history/${courseId}`, {
      headers: this.getHeaders()
    });
  }

  async clearAllChatHistories(): Promise<void> {
    await axios.delete(`${this.baseURL}/chat/histories`, {
      headers: this.getHeaders()
    });
  }

  async queryTeachingAgent(
    courseId: string,
    query: string,
    lang: string = 'en'
  ): Promise<string> {
    const response = await axios.post(`${this.baseURL}/teaching-agent`, {
      course_id: courseId,
      additional_info: query,
      lang
    }, { headers: this.getHeaders() });

    return response.data.data.response;
  }
}

export default AIChatService;
```

### React Hook Example
```typescript
import { useState, useEffect } from 'react';
import AIChatService from './AIChatService';

export const useAIChat = (courseId: string, token: string) => {
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const aiService = new AIChatService(token);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const history = await aiService.getChatHistory(courseId);
      setChatHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, lang: string = 'en') => {
    try {
      setLoading(true);
      const result = await aiService.sendMessage(courseId, message, lang);
      setChatHistory(result.chatHistory);
      return result.response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await aiService.clearChatHistory(courseId);
      setChatHistory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    }
  };

  useEffect(() => {
    if (courseId && token) {
      loadChatHistory();
    }
  }, [courseId, token]);

  return {
    chatHistory,
    loading,
    error,
    sendMessage,
    clearHistory,
    refreshHistory: loadChatHistory
  };
};
```

### React Component Example
```typescript
import React, { useState } from 'react';
import { useAIChat } from './useAIChat';

interface AIChatComponentProps {
  courseId: string;
  token: string;
}

const AIChatComponent: React.FC<AIChatComponentProps> = ({ courseId, token }) => {
  const [message, setMessage] = useState('');
  const { chatHistory, loading, error, sendMessage, clearHistory } = useAIChat(courseId, token);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h3>AI Assistant</h3>
        <button onClick={clearHistory} disabled={loading}>
          Clear History
        </button>
      </div>
      
      <div className="chat-messages">
        {chatHistory?.messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask the AI assistant..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !message.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default AIChatComponent;
```

---

## Language Support

The API supports multiple languages. Use the appropriate language code in the `lang` parameter:

| Language | Code | Example Query |
|----------|------|--------------|
| English | `en` | "Explain the concept of recursion" |
| Spanish | `es` | "Explica el concepto de recursión" |
| French | `fr` | "Expliquez le concept de récursion" |
| German | `de` | "Erklären Sie das Konzept der Rekursion" |
| Portuguese | `pt` | "Explique o conceito de recursão" |
| Italian | `it` | "Spiega il concetto di ricorsione" |
| Chinese | `zh` | "解释递归的概念" |
| Japanese | `ja` | "再帰の概念を説明してください" |

---

## Error Handling

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

### Frontend Error Handling Example
```typescript
try {
  const result = await aiService.sendMessage(courseId, message);
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    switch (status) {
      case 400:
        // Handle validation errors
        console.error('Validation errors:', errorData.errors);
        break;
      case 401:
        // Handle authentication errors
        console.error('Authentication failed');
        // Redirect to login
        break;
      case 500:
        // Handle server errors
        console.error('Server error occurred');
        break;
      default:
        console.error('Unexpected error:', errorData.message);
    }
  }
}
```

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Input Validation**: All inputs are validated server-side
3. **Rate Limiting**: Implement client-side rate limiting for better UX
4. **Data Sanitization**: Sanitize user inputs before display
5. **HTTPS**: Use HTTPS in production environments
6. **Token Storage**: Store JWT tokens securely (httpOnly cookies recommended)

---

## Performance Tips

1. **Optimistic Updates**: Add user messages immediately to the UI for better UX
2. **Debounced Input**: Implement debouncing for real-time features
3. **Error Recovery**: Implement retry logic with exponential backoff
4. **Caching**: Cache chat histories locally when appropriate
5. **Pagination**: Consider implementing pagination for large chat histories
6. **Connection Management**: Reuse HTTP connections when possible

---

## Testing

### Unit Test Example (Jest)
```typescript
import AIChatService from './AIChatService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AIChatService', () => {
  const service = new AIChatService('test-token');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send message successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          response: 'AI response',
          chatHistory: { /* mock chat history */ }
        }
      }
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await service.sendMessage('course-id', 'test message');
    
    expect(result.response).toBe('AI response');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:5051/api/ai/chat/message',
      {
        courseId: 'course-id',
        message: 'test message',
        additionalInfo: undefined,
        lang: 'en'
      },
      { headers: expect.any(Object) }
    );
  });
});
```

---

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if JWT token is valid and not expired
   - Ensure token is included in Authorization header
   - Verify token format: `Bearer <token>`

2. **400 Bad Request**
   - Validate all required fields are provided
   - Check field types and formats
   - Ensure courseId is a valid MongoDB ObjectId

3. **500 Internal Server Error**
   - Check server logs for detailed error information
   - Verify database connection
   - Check if AI service is responding

4. **Network Errors**
   - Verify server is running on correct port
   - Check firewall settings
   - Ensure CORS is configured properly

### Debug Mode
Enable debug logging in your frontend application:

```typescript
class AIChatService {
  private debug = process.env.NODE_ENV === 'development';

  private log(message: string, data?: any) {
    if (this.debug) {
      console.log(`[AIChatService] ${message}`, data);
    }
  }

  async sendMessage(courseId: string, message: string) {
    this.log('Sending message', { courseId, message });
    // ... rest of implementation
  }
}
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Basic chat functionality
- Multi-language support
- One chat session per course model
- JWT authentication
- Message persistence

---

## Support

For technical support or questions about this API:

1. Check this documentation first
2. Review server logs for error details
3. Test endpoints using tools like Postman or curl
4. Contact the development team with specific error messages and request details

---

*This documentation covers the AI Chat API v1.0.0*
*Last updated: January 2024*