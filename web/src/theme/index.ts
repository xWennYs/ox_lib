import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  defaultRadius: 'sm',
  radius: { sm: 8, md: 12, xl: 999 },
  // dark scale remapped to Hairline Mono surfaces (index 7=raised,8=surface,9=bg)
  colors: {
    dark: [
      '#FAFAFA',
      '#A1A1AA',
      '#71717A',
      '#52525B',
      '#3F3F46',
      '#27272A',
      '#1F1F23',
      '#16161A',
      '#0D0D0F',
      '#08080A',
    ] as any,
  },
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.4)', md: '0 2px 8px rgba(0,0,0,0.5)' },
  components: {
    Button: {
      styles: {
        root: { border: 'none', borderRadius: 8, fontWeight: 600 },
      },
    },
    Modal: {
      styles: {
        modal: {
          backgroundColor: 'var(--ov-surface)',
          border: '1px solid var(--ov-border)',
          borderRadius: 12,
        },
        title: {
          fontWeight: 600,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          fontSize: 11,
          color: 'var(--ov-text)',
        },
      },
    },
    Input: {
      styles: {
        input: {
          backgroundColor: 'var(--ov-bg)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 8,
          color: 'var(--ov-text)',
          '&:focus': { borderColor: 'rgba(255,255,255,0.28)' },
          '&::placeholder': { color: 'var(--ov-muted)' },
        },
      },
    },
    Paper: {
      styles: {
        root: {
          backgroundColor: 'var(--ov-surface)',
          border: '1px solid var(--ov-border)',
        },
      },
    },
  },
};
