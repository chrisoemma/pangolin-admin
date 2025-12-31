import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Search, CreditCard, Eye, Trash2 } from 'lucide-react'
import { mockPaymentMethods, type PaymentMethod } from '../../../data/mockData'
import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'

const PaymentMethods = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  // TODO: Replace with actual data from API
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch payment methods from API
    setLoading(true)
    setTimeout(() => {
      setPaymentMethods(mockPaymentMethods)
      setLoading(false)
    }, 500)
  }, [])

  const filteredPaymentMethods = useMemo(() => 
    paymentMethods.filter(
      (method) =>
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.type.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [paymentMethods, searchTerm]
  )

  const totalPages = Math.ceil(filteredPaymentMethods.length / itemsPerPage)
  const paginatedPaymentMethods = filteredPaymentMethods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      // TODO: Replace with actual API call
      setPaymentMethods(prev => prev.filter(method => method.id !== id))
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      bank_transfer: 'Bank Transfer',
      other: 'Other',
    }
    return labels[type] || type
  }

  if (loading) {
    return <Loader fullScreen text="Loading payment methods..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600 mt-2">Manage payment methods in the system</p>
        </div>
        <Link
          to="/settings/payments/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Payment Method
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search payment methods by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Payment Methods Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPaymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">No payment methods found</p>
            <Link
              to="/settings/payments/new"
              className="text-primary hover:underline font-medium"
            >
              Add your first payment method
            </Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPaymentMethods.map((method) => (
                <tr key={method.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{method.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{getTypeLabel(method.type)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      method.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {method.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/settings/payments/${method.id}`)}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <Link
                      to={`/settings/payments/${method.id}/edit`}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredPaymentMethods.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPaymentMethods.length}
          />
        )}
      </div>
    </div>
  )
}

export default PaymentMethods

