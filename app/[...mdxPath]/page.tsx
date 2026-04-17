import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '@/mdx-components'
import { Metadata } from 'next'

type PageProps = {
  params: Promise<{ mdxPath: string[] }>
}

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mdxPath } = await params
  const { metadata } = await importPage(mdxPath)
  return metadata
}

export default async function Page(props: PageProps) {
  const { mdxPath } = await props.params
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(mdxPath)
  
  // Pass an empty object to satisfy the argument requirement
  const components = useMDXComponents({})
  const Wrapper = components.wrapper || (({ children }: any) => <>{children}</>)

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} />
    </Wrapper>
  )
}