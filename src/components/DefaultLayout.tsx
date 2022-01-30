import Head from 'next/head'

type DefaultLayoutProps = { children: React.ReactNode }

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <>
            <Head>
                <meta lang="en" charSet="UTF-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="inv - The premier way of managing invoices" />
                <title>inv</title>
            </Head>

            <div className="h-screen w-screen bg-neutral-50 text-neutral-900 subpixel-antialiased">{children}</div>
        </>
    )
}
