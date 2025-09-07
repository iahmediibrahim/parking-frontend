import Link from 'next/link'

interface NavLinkProps {
	href: string
	children: React.ReactNode
	className?: string
	active?: boolean
}

export function NavLink({
	href,
	children,
	className = '',
	active = false,
}: NavLinkProps) {
	return (
		<Link
			href={href}
			className={`relative ${
				active ? 'text-[#ef4937] border-[#ef4937]' : 'text-[#4A4A4A]'
			} hover:text-[#ef4937] transition-colors duration-200 
    after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-[#ef4937] 
    after:left-0 after:bottom-[-4px] ${
			active ? 'after:scale-x-100' : 'after:scale-x-0'
		} hover:after:scale-x-100 
    after:transition-transform after:duration-300 ${className}`}
		>
			{children}
		</Link>
	)
}
