import { describe, expect, it } from 'vitest';
import { validateProfilePhoto } from '@/lib/profile-photo';

describe('Profile photo uploads', () => {
  it('permits a photo of exactly 5 MB and rejects larger files', () => {
    expect(validateProfilePhoto({ type: 'image/jpeg', size: 5 * 1024 * 1024 })).toBeNull();
    expect(validateProfilePhoto({ type: 'image/jpeg', size: 5 * 1024 * 1024 + 1 })).toBe('A foto deve ter até 5 MB.');
  });
  it('accepts only JPG, PNG and WebP images, not active SVG or empty files', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) expect(validateProfilePhoto({ type, size: 100 })).toBeNull();
    expect(validateProfilePhoto({ type: 'image/svg+xml', size: 100 })).toBe('Escolha uma foto JPG, PNG ou WebP.');
    expect(validateProfilePhoto({ type: 'image/png', size: 0 })).toBe('Esta foto está vazia. Escolha outra imagem.');
  });
});