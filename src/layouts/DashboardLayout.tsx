import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ShoppingCart, 
  CreditCard,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Database,
  User
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutUser } from '../store/slices/authSlice'

interface MenuItem {
  path: string
  icon: any
  label: string
  children?: MenuItem[]
}

const DashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['settings'])

  const currentUser = {
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@pangolin.edu',
    role: user?.role || 'Administrator'
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }

  const menuItems: MenuItem[] = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/books', icon: BookOpen, label: 'Books' },
    { path: '/discussions', icon: Users, label: 'Discussions' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    {
      path: '/master-data',
      icon: Database,
      label: 'Master Data',
      children: [
        { path: '/master-data/faculties', icon: Database, label: 'Faculties' },
        { path: '/master-data/departments', icon: Database, label: 'Departments' },
        { path: '/master-data/semesters', icon: Database, label: 'Semesters' },
        { path: '/master-data/year-of-study', icon: Database, label: 'Year of Study' },
        { path: '/master-data/subjects', icon: Database, label: 'Subjects' },
        { path: '/master-data/topics', icon: Database, label: 'Topics' },
        { path: '/master-data/authors', icon: BookOpen, label: 'Authors' },
        { path: '/master-data/tutors', icon: Users, label: 'Tutors' },
        { path: '/master-data/categories', icon: Database, label: 'Categories' },
        { path: '/master-data/venues', icon: Database, label: 'Venues' },
      ]
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      children: [
        { path: '/settings/general', icon: Settings, label: 'General' },
        { path: '/settings/payments', icon: CreditCard, label: 'Payment Methods' },
        { path: '/settings/notifications', icon: Settings, label: 'Notifications' },
        { path: '/settings/users', icon: Users, label: 'Users & Roles' },
        { path: '/settings/system', icon: Settings, label: 'System Configuration' },
      ]
    },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const isExactActive = (path: string) => {
    return location.pathname === path
  }

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedMenus.includes(item.path)
    const active = isActive(item.path)
    const Icon = item.icon

    if (hasChildren) {
      return (
        <div key={item.path}>
          <button
            onClick={() => toggleMenu(item.path)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              active
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={{ paddingLeft: `${level * 1 + 1}rem` }}
          >
            <div className="flex items-center gap-3">
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    const isExact = isExactActive(item.path)
    const isChild = level > 0

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isExact
            ? isChild
              ? 'bg-white text-primary border-2 border-primary font-semibold'
              : 'bg-primary text-white'
            : isChild
            ? 'text-gray-600 hover:bg-gray-50'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 1 + 1}rem` }}
      >
        <Icon size={20} />
        <span className="font-medium">{item.label}</span>
      </Link>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary">Pangolin Admin</h1>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
