import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TrendingUp, Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useTheme } from '@/contexts/ThemeContext'
import { NAV_ITEMS } from '@/utils'
import { cn } from '@/lib/utils'

/**
 * Modern trading app header with navigation
 */
export function Header() {
    const { isDark, toggleTheme } = useTheme()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    const isActivePage = (path: string) => {
        if (path === '/' && location.pathname === '/') return true
        if (path !== '/' && location.pathname.startsWith(path)) return true
        return false
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center space-x-2 mr-6"
                >
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                        <TrendingUp className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="hidden sm:inline-block text-xl font-bold gradient-text">
                        InvestAI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1 flex-1">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActivePage(item.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side actions */}
                <div className="flex items-center space-x-2 ml-auto">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9"
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                {isOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                            <nav className="flex flex-col space-y-2 mt-6">
                                {NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                                            isActivePage(item.path)
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
