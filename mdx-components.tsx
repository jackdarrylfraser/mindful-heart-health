import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types';

// Get the default MDX components
const themeComponents = getThemeComponents()

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...themeComponents,
    ...components
  };
}