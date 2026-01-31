# API Documentations

This API documentation is auto-generated from the backend Swagger to facilitate development with AI coding assistants (vibe coding).

## Why Duplicate?

The backend already provides Swagger as the official API documentation. However, this Markdown documentation is created for the following purposes:

1. **Context for AI Assistant** - Markdown files are easier for AI coding assistants (such as Claude, Cursor, etc.) to read compared to fetching from a Swagger endpoint
2. **Offline Access** - Documentation is available directly in the repository without needing to run the backend
3. **Version Control** - API changes can be tracked through git history

## Structure

```
api-documentations/
├── README.md           # This file
└── core-api/           # Core API documentation
    ├── index.md        # Overview & base info
    ├── auth.md         # Authentication endpoints
    ├── categories.md   # Categories endpoints
    ├── tickets.md      # Tickets/reports endpoints
    └── ...
```

## Important Notes

- This documentation is **read-only** and should not be manually edited
- If there are API changes, regenerate from the backend Swagger
- For official and up-to-date documentation, always refer to the backend Swagger
