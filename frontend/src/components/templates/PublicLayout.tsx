import { Header } from "@/components/organisms/Header"

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  )
}