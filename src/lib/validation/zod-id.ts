import { z } from 'zod';

/**
 * Indonesian error map for Zod v4 validation
 *
 * This provides user-friendly Indonesian error messages for all Zod validation errors.
 * Import this file once in your app (e.g., in providers) to apply globally.
 *
 * @example
 * // In src/providers/query-provider.tsx
 * import '@/lib/validation/zod-id';
 */
z.config({
  customError: (issue) => {
    switch (issue.code) {
      case 'invalid_type':
        if (issue.input === undefined || issue.input === null) {
          return 'Wajib diisi';
        }
        if (issue.expected === 'string') {
          return 'Harus berupa teks';
        }
        if (issue.expected === 'number') {
          return 'Harus berupa angka';
        }
        if (issue.expected === 'boolean') {
          return 'Harus berupa boolean';
        }
        if (issue.expected === 'array') {
          return 'Harus berupa array';
        }
        if (issue.expected === 'object') {
          return 'Harus berupa objek';
        }
        return 'Tipe data tidak valid';

      case 'invalid_value':
        return 'Nilai tidak valid';

      case 'invalid_format':
        if (issue.format === 'email') {
          return 'Format email tidak valid';
        }
        if (issue.format === 'url') {
          return 'Format URL tidak valid';
        }
        if (issue.format === 'uuid') {
          return 'Format UUID tidak valid';
        }
        if (issue.format === 'datetime') {
          return 'Format tanggal/waktu tidak valid';
        }
        if (issue.format === 'ip') {
          return 'Format alamat IP tidak valid';
        }
        if (issue.format === 'regex') {
          return 'Format tidak valid';
        }
        return 'Format tidak valid';

      case 'too_small':
        if (issue.minimum === 1 && issue.origin === 'string') {
          return 'Wajib diisi';
        }
        if (issue.origin === 'string') {
          return `Minimal ${issue.minimum} karakter`;
        }
        if (issue.origin === 'number') {
          return `Minimal ${issue.minimum}`;
        }
        if (issue.origin === 'array') {
          return `Minimal ${issue.minimum} item`;
        }
        return `Minimal ${issue.minimum}`;

      case 'too_big':
        if (issue.origin === 'string') {
          return `Maksimal ${issue.maximum} karakter`;
        }
        if (issue.origin === 'number') {
          return `Maksimal ${issue.maximum}`;
        }
        if (issue.origin === 'array') {
          return `Maksimal ${issue.maximum} item`;
        }
        return `Maksimal ${issue.maximum}`;

      case 'invalid_union':
        return 'Input tidak valid';

      case 'unrecognized_keys':
        return `Field tidak dikenali: ${issue.keys.join(', ')}`;

      case 'not_multiple_of':
        return `Harus kelipatan dari ${issue.divisor}`;

      case 'custom':
        return issue.message ?? 'Input tidak valid';

      default:
        return 'Input tidak valid';
    }
  },
});
