import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, CreditCard } from 'lucide-react'
import { mockPaymentMethods, type PaymentMethod } from '../../../data/mockData'
import Loader from '../../../components/Loader'

const PaymentMethodDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch payment method data from API
    setLoading(true)
    const foundMethod = mockPaymentMethods.find(m => m.id === id)
    if (foundMethod) {
      setPaymentMethod(foundMethod)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading payment method..." />
  }

  if (!paymentMethod) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Payment method not found</p>
          <button
            onClick={() => navigate('/settings/payments')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Payment Methods
          </button>
        </div>
      </div>
    )
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/settings/payments')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{paymentMethod.name}</h1>
          <p className="text-gray-600 mt-2">Payment Method Details</p>
        </div>
        <Link
          to={`/settings/payments/${paymentMethod.id}/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 mt-1">{paymentMethod.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="text-gray-900 mt-1">{getTypeLabel(paymentMethod.type)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  paymentMethod.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {paymentMethod.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created Date</label>
              <p className="text-gray-900 mt-1">{new Date(paymentMethod.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {paymentMethod.configuration && (
            <div>
              <label className="text-sm font-medium text-gray-500">Configuration</label>
              <pre className="mt-1 p-4 bg-gray-50 rounded-lg text-sm font-mono overflow-auto">
                {JSON.stringify(paymentMethod.configuration, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodDetail

