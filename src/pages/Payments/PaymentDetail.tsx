import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, User, Package } from 'lucide-react'
import { type Payment } from '../../data/mockData'
import { paymentsService } from '../../services/paymentsService'
import Loader from '../../components/Loader'

const PaymentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayment = async () => {
      if (!id) return
      setLoading(true)
      try {
        const response = await paymentsService.getById(id)
        if (response.status && response.data) {
          setPayment(response.data)
        }
      } catch (error) {
        console.error('Error fetching payment:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayment()
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading payment..." />
  }

  if (!payment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Payment not found</p>
          <button
            onClick={() => navigate('/payments')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Payments
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/payments')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Payment #{payment.id}</h1>
          <p className="text-gray-600 mt-2">Payment Details and Information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment ID</label>
                  <p className="text-gray-900 mt-1">{payment.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <p className="text-gray-900 mt-1">{payment.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Date</label>
                  <p className="text-gray-900 mt-1">{new Date(payment.paymentDate).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Package className="text-primary" size={32} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{payment.itemName}</p>
                <p className="text-sm text-gray-500 mt-1">Item ID: {payment.itemId}</p>
                <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                  payment.itemType === 'book' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {payment.itemType}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="text-primary" size={24} />
                <div>
                  <p className="font-medium text-gray-900">{payment.studentName}</p>
                  <p className="text-sm text-gray-500">{payment.studentEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-gray-900">${payment.amount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total Paid</span>
                <span className={`font-bold text-lg ${
                  payment.status === 'success' ? 'text-green-600' :
                  payment.status === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  ${payment.status === 'success' ? payment.amount.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetail


