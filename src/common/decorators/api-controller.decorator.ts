import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Custom decorator to automatically add @ApiTags and @ApiBearerAuth
 * @param path  Controller route, e.g., 'users'
 * @param options  { auth?: boolean } - If true, adds @ApiBearerAuth
 */
export function ApiController(path: string, options?: { auth?: boolean }) {
  const tagName = capitalize(path);

  const decorators = [Controller(path), ApiTags(tagName)];
  if (options?.auth) decorators.push(ApiBearerAuth());

  return applyDecorators(...decorators);
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
