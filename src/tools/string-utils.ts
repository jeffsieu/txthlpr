const limit = 10;

export function truncate(input: string): string {
  return input.length > limit ? input.substring(0, limit) + '...': input;
}