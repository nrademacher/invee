import Link from 'next/link'
import Head from 'next/head'
import { Avatar, InveeLogo } from '../lib'
import { AdjustmentsIcon, DotsVerticalIcon, HomeIcon, InboxIcon, ViewBoardsIcon } from '@heroicons/react/outline'

type SidebarMenuItemProps = { link: string; icon: JSX.Element; children: React.ReactText }

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ link, icon, children }) => (
    <Link href={link}>
        <a className="flex cursor-pointer items-center">
            <span className="mr-3 h-5 w-5 text-neutral-500">{icon}</span>
            <span className="hidden transition-colors hover:text-neutral-300 lg:inline">{children}</span>
        </a>
    </Link>
)

type SidebarLayoutProps = {
    children: React.ReactNode
    pageName: string
    currentUserName: string
    currentUserAvatar?: string
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
    children,
    pageName,
    currentUserName,
    currentUserAvatar,
}) => (
    <>
        <Head>
            <title>invee | {pageName}</title>
        </Head>
        <div className="flex h-full flex-col lg:flex-row">
            <section className="flex flex-row items-center justify-between divide-x divide-neutral-600 bg-neutral-900 p-6 text-neutral-400 lg:flex-col lg:items-start lg:divide-x-0 lg:divide-y lg:pt-10 lg:pb-12">
                <article className="w-full">
                    <header className="mb-16 hidden lg:block">
                        <InveeLogo color="#fff" className="w-20 fill-red-400" />
                    </header>
                    <div className="w-full">
                        <h2 className="mb-4 hidden font-caption text-sm uppercase text-neutral-600 lg:inline-block">
                            Overview
                        </h2>
                        <nav className="flex h-full w-full flex-row justify-evenly font-medium lg:flex-col lg:space-x-0 lg:space-y-5">
                            <SidebarMenuItem link="/dashboard" icon={<HomeIcon />}>
                                Dashboard
                            </SidebarMenuItem>
                            <SidebarMenuItem link="/outbox" icon={<InboxIcon />}>
                                Outbox
                            </SidebarMenuItem>
                            <SidebarMenuItem link="/projects" icon={<ViewBoardsIcon />}>
                                Projects
                            </SidebarMenuItem>
                            <SidebarMenuItem link="/settings" icon={<AdjustmentsIcon />}>
                                Settings
                            </SidebarMenuItem>
                        </nav>
                    </div>
                </article>
                <article className="self-end pl-6 lg:pl-0 lg:pt-8">
                    <div className="flex max-w-min items-center text-neutral-200 lg:mx-auto">
                        <span className="mr-1 flex items-center lg:mr-3">
                            <Avatar
                                imageUrl={currentUserAvatar || ''}
                                userName={currentUserName}
                                className="mr-2.5 h-11 w-11 border-2 border-neutral-200"
                            />
                            <span className="hidden font-medium lg:inline-block">{currentUserName}</span>{' '}
                        </span>
                        <a className="">
                            <DotsVerticalIcon className="h-5 w-5 text-neutral-400" />
                        </a>
                    </div>
                </article>
            </section>
            {children}
        </div>
    </>
)
