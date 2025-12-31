import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, FileText, Users, BookOpen, HardDrive, File } from 'lucide-react'
import { type Book } from '../../data/mockData'
import { booksService } from '../../services/booksService'
import { ordersService } from '../../services/ordersService'
import type { Order } from '../../data/mockData'
import Loader from '../../components/Loader'

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [_bookOrders, setBookOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return
      setLoading(true)
      try {
        const [bookResponse, ordersResponse] = await Promise.all([
          booksService.getById(id),
          ordersService.getAll()
        ])
        
        if (bookResponse.status && bookResponse.data) {
          setBook(bookResponse.data)
        }
        
        if (ordersResponse.status && ordersResponse.data) {
          const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : []
          setBookOrders(orders.filter(order => order.itemType === 'book' && order.itemId === id))
        }
      } catch (error) {
        console.error('Error fetching book data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookData()
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading book..." />
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Book not found</p>
          <button
            onClick={() => navigate('/books')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Books
          </button>
        </div>
      </div>
    )
  }
  // const hardCopyOrders = bookOrders.filter(order => {
  //   // In real app, order would have copyType field
  //   return true // Placeholder
  // })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/books')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-gray-600 mt-2">Book Details and Statistics</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/books/${book.id}/edit`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Edit size={18} />
            Edit
          </Link>
          <Link
            to={`/books/${book.id}/answers`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <FileText size={18} />
            Manage Answers
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Title</label>
                  <p className="text-gray-900 mt-1">{book.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Author</label>
                  <p className="text-gray-900 mt-1">{book.author}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Topic</label>
                  <p className="text-gray-900 mt-1">{book.topic}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-gray-900 mt-1">{new Date(book.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1">{book.description}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive size={20} className="text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">Hard Copy</label>
                </div>
                <p className="text-2xl font-bold text-gray-900">${book.hardCopyPrice.toFixed(2)}</p>
              </div>
              {book.softCopyAvailable ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <File size={20} className="text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Soft Copy (PDF)</label>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${book.softCopyPrice.toFixed(2)}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg opacity-50">
                  <div className="flex items-center gap-2 mb-2">
                    <File size={20} className="text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Soft Copy</label>
                  </div>
                  <p className="text-sm text-gray-500">Not Available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Statistics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className="text-primary" />
                  <label className="text-sm font-medium text-gray-700">Total Purchases</label>
                </div>
                <p className="text-3xl font-bold text-primary">{book.totalPurchases}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive size={20} className="text-blue-600" />
                  <label className="text-sm font-medium text-gray-700">Hard Copy Purchases</label>
                </div>
                <p className="text-2xl font-bold text-blue-600">{book.hardCopyPurchases}</p>
              </div>
              {book.softCopyAvailable && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <File size={20} className="text-green-600" />
                    <label className="text-sm font-medium text-gray-700">Soft Copy Purchases</label>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{book.softCopyPurchases}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to={`/books/${book.id}/edit`}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                Edit Book
              </Link>
              <Link
                to={`/books/${book.id}/answers`}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <FileText size={18} />
                Manage Answers
              </Link>
              <Link
                to="/orders"
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <Users size={18} />
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail


