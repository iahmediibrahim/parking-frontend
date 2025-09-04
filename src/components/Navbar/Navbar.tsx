'use client'
import { useAuthStore } from '@/store/authStore'
import { NavLink } from '../NavLink'
import { useState } from 'react'
import { PrimaryButton } from '../PrimaryButton'
import { usePathname } from 'next/navigation'

const routes = [
	{
		role: 'employee',
		href: '/checkpoint',
		label: 'Checkpoint',
	},
	{
		role: 'admin',
		href: '/admin',
		label: 'Dashboard',
	},
]

export function Navbar() {
	const { user, logout } = useAuthStore()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const pathname = usePathname()

	return (
		<nav className="bg-white shadow-sm p-4">
			<div className="container mx-auto">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-6">
						<NavLink
							href="/"
							className={`text-xl font-bold ${
								pathname === '/' ? 'text-[#ef4937]' : ''
							}`}
						>
							PRS
						</NavLink>

						<div className="hidden md:flex items-center space-x-6">
							{routes.map(
								(link) =>
									user?.role === link.role && (
										<NavLink
											key={link.href}
											href={link.href}
											active={pathname === link.href}
										>
											{link.label}
										</NavLink>
									),
							)}
						</div>
					</div>

					<div className="hidden md:flex items-center space-x-4">
						{user ? (
							<>
								<span className="text-[#ef4937]">Hello, {user.username}</span>
								<PrimaryButton onClick={logout}>Logout</PrimaryButton>
							</>
						) : (
							<NavLink
								href="/login"
								className={pathname === '/login' ? 'text-[#ef4937]' : ''}
							>
								Login
							</NavLink>
						)}
					</div>

					{/* Mobile menu button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d={
									isMenuOpen
										? 'M6 18L18 6M6 6l12 12'
										: 'M4 6h16M4 12h16M4 18h16'
								}
							/>
						</svg>
					</button>
				</div>

				{/* Mobile menu */}
				{isMenuOpen && (
					<div className="md:hidden mt-4 space-y-4">
						{routes.map(
							(link) =>
								user?.role === link.role && (
									<NavLink
										key={link.href}
										href={link.href}
										active={pathname === link.href}
										className={`block py-2 `}
									>
										{link.label}
									</NavLink>
								),
						)}
						{user ? (
							<div className="space-y-4">
								<span className="block text-[#ef4937]">
									Hello, {user.username}
								</span>
								<PrimaryButton onClick={logout}>Logout</PrimaryButton>
							</div>
						) : (
							<NavLink
								href="/login"
								className={`block py-2 ${
									pathname === '/login' ? 'text-[#ef4937]' : ''
								}`}
							>
								Login
							</NavLink>
						)}
					</div>
				)}
			</div>
		</nav>
	)
}
