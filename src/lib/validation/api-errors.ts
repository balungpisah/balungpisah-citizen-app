import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import type { ApiClientError } from '@/lib/api/types';

/**
 * Map API validation errors to react-hook-form field errors
 *
 * Use this in useMutation's onError callback to display server-side
 * validation errors on the appropriate form fields.
 *
 * @example
 * const form = useForm({ resolver: zodResolver(schema) });
 *
 * const { mutate } = useMutation({
 *   resource: 'users',
 *   onError: (error) => setApiErrors(error, form.setError),
 * });
 *
 * @example
 * // With custom field mapping (when API field names differ from form field names)
 * const { mutate } = useMutation({
 *   resource: 'users',
 *   onError: (error) => setApiErrors(error, form.setError, {
 *     'email_address': 'email',      // API uses email_address, form uses email
 *     'phone_number': 'whatsapp',    // API uses phone_number, form uses whatsapp
 *   }),
 * });
 */
export function setApiErrors<T extends FieldValues>(
  error: ApiClientError,
  setError: UseFormSetError<T>,
  fieldMapping?: Record<string, Path<T>>
): void {
  // Handle field-level validation errors
  if (error.errors) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      // Use field mapping if provided, otherwise use field name directly
      const formField = fieldMapping?.[field] ?? (field as Path<T>);
      const message = Array.isArray(messages) ? messages[0] : messages;

      setError(formField, {
        type: 'server',
        message: String(message),
      });
    });
    return;
  }

  // Handle general error message - set on root
  if (error.message) {
    setError('root' as Path<T>, {
      type: 'server',
      message: error.message,
    });
  }
}

/**
 * Check if an error has field-level validation errors
 *
 * @example
 * const { mutate } = useMutation({
 *   resource: 'users',
 *   onError: (error) => {
 *     if (hasFieldErrors(error)) {
 *       setApiErrors(error, form.setError);
 *     } else {
 *       toast.error(error.message);
 *     }
 *   },
 * });
 */
export function hasFieldErrors(error: ApiClientError): boolean {
  return Boolean(error.errors && Object.keys(error.errors).length > 0);
}
