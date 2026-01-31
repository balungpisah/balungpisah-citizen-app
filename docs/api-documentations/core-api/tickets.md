# Tickets API

---

## API Endpoints

| Method | Endpoint                       | Description                    | Parameters                       | Request Body | Response                             |
| ------ | ------------------------------ | ------------------------------ | -------------------------------- | ------------ | ------------------------------------ |
| GET    | `/api/tickets`                 | List user's tickets            | -                                | -            | `IApiResponse_Vec_TicketResponseDto` |
| GET    | `/api/tickets/ref/{reference}` | Get ticket by reference number | `Iget_ticket_by_referenceParams` | -            | `IApiResponse_TicketResponseDto`     |
| GET    | `/api/tickets/{id}`            | Get ticket by ID               | `Iget_ticketParams`              | -            | `IApiResponse_TicketResponseDto`     |

---

## TypeScript Interfaces

```typescript
interface IApiResponse_TicketResponseDto {
  data?: ITicketResponseDto; // Response DTO for ticket
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IApiResponse_Vec_TicketResponseDto {
  data?: ITicketResponseDto[];
  errors?: string[] | null;
  message?: string | null;
  meta?: any | IMeta;
  success: boolean;
}

interface IMeta {
  total: number; // (int64)
}

interface ITicketResponseDto {
  adk_thread_id: string; // (uuid)
  completeness_score?: number | null; // (double)
  confidence_score: number; // (double)
  created_at: string; // (date-time)
  id: string; // (uuid)
  platform: string;
  processed_at?: string | null; // (date-time)
  reference_number: string;
  status: ITicketStatus;
  submitted_at: string; // (date-time)
}

interface ITicketStatus {}

interface Iget_ticketParams {
  id: string; // Ticket ID (in: path) (uuid)
}

interface Iget_ticket_by_referenceParams {
  reference: string; // Ticket reference number (e.g., TKT-2026-0000001) (in: path)
}
```
