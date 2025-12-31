import { useState, useEffect } from 'react'
import { BookOpen, Users, ShoppingCart, CreditCard, TrendingUp } from 'lucide-react'
import { mockDiscussions } from '../data/mockData'
import type { Book, Order, Payment } from '../data/mockData'
import { booksService } from '../services/booksService'
import { ordersService } from '../services/ordersService'
import { paymentsService } from '../services/paymentsService'
import Loader from '../components/Loader'

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [booksResponse, ordersResponse, paymentsResponse] = await Promise.all([
          booksService.getAll(),
          ordersService.getAll(),
          paymentsService.getAll()
        ])

        if (booksResponse.status && booksResponse.data) {
          setBooks(Array.isArray(booksResponse.data) ? booksResponse.data : [])
        }
        if (ordersResponse.status && ordersResponse.data) {
          setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : [])
        }
        if (paymentsResponse.status && paymentsResponse.data) {
          setPayments(Array.isArray(paymentsResponse.data) ? paymentsResponse.data : [])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, payment) => sum + payment.amount, 0)
  
  const activeDiscussions = mockDiscussions.filter(d => d.enrolledStudents > 0).length
  
  const stats = [
    { label: 'Total Books', value: books.length.toString(), icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Active Discussions', value: activeDiscussions.toString(), icon: Users, color: 'bg-green-500' },
    { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingCart, color: 'bg-yellow-500' },
    { label: 'Total Revenue', value: `Tsh ${totalRevenue.toFixed(2)}`, icon: CreditCard, color: 'bg-primary' },
  ]
  
  const recentOrders = orders.slice(0, 5)
  const recentPayments = payments.filter(p => p.status === 'success').slice(0, 5)

  if (loading) {
    return <Loader fullScreen text="Loading dashboard..." />
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Pangolin Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
              <p>No recent orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.itemName}</p>
                    <p className="text-sm text-gray-500">{order.studentName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Payments</h2>
          {recentPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard size={48} className="mx-auto mb-2 opacity-50" />
              <p>No recent payments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{payment.itemName}</p>
                    <p className="text-sm text-gray-500">{payment.studentName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${payment.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

