import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { mockPaymentMethods, type PaymentMethod } from '../../../data/mockData'
import Loader from '../../../components/Loader'

const PaymentMethodForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    type: 'credit_card' as PaymentMethod['type'],
    isActive: true,
    configuration: '',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      // TODO: Fetch payment method data from API
      const method = mockPaymentMethods.find(m => m.id === id)
      if (method) {
        setFormData({
          name: method.name,
          type: method.type,
          isActive: method.isActive,
          configuration: JSON.stringify(method.configuration || {}, null, 2),
        })
      }
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      let config = {}
      try {
        config = JSON.parse(formData.configuration)
      } catch {
        // Invalid JSON, use empty object
      }
      
      console.log('Submitting payment method:', { ...formData, configuration: config })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      navigate('/settings/payments')
    } catch (error) {
      console.error('Error saving payment method:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }))
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving payment method..." />}
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/settings/payments')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update payment method information' : 'Add a new payment method to the system'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Credit Card, PayPal"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
            Active (Enable this payment method)
          </label>
        </div>

        <div>
          <label htmlFor="configuration" className="block text-sm font-medium text-gray-700 mb-1">
            Configuration (JSON)
          </label>
          <textarea
            id="configuration"
            name="configuration"
            rows={6}
            value={formData.configuration}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            placeholder='{"apiKey": "your-api-key", "mode": "live"}'
          />
          <p className="mt-1 text-xs text-gray-500">Enter configuration as JSON format</p>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/settings/payments')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Payment Method' : 'Create Payment Method'}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}

export default PaymentMethodForm

