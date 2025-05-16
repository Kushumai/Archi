import { NavLink } from "@/components/atoms/Navlink"

export function NavBar() {
  return (
    <nav className="hidden md:flex gap-2 items-center">
      <NavLink href="/">Accueil</NavLink>
      <NavLink href="/login">Connexion</NavLink>
      <NavLink href="/register">Inscription</NavLink>
    </nav>
  )
}