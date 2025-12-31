import { useState } from 'react'
import { Save, Bell } from 'lucide-react'
import Loader from '../../components/Loader'

const Notifications = () => {
  const [formData, setFormData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    paymentNotifications: true,
    studentEnrollmentNotifications: true,
    discussionNotifications: true,
    weeklyReport: true,
    monthlyReport: false,
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      console.log('Saving notification settings:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Notification settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving settings..." />}
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        <p className="text-gray-600 mt-2">Manage notification preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={20} />
            Notification Channels
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">SMS Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={formData.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Order Notifications</label>
                <p className="text-xs text-gray-500">Get notified when new orders are placed</p>
              </div>
              <input
                type="checkbox"
                checked={formData.orderNotifications}
                onChange={() => handleToggle('orderNotifications')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Payment Notifications</label>
                <p className="text-xs text-gray-500">Get notified about payment transactions</p>
              </div>
              <input
                type="checkbox"
                checked={formData.paymentNotifications}
                onChange={() => handleToggle('paymentNotifications')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Student Enrollment Notifications</label>
                <p className="text-xs text-gray-500">Get notified when students enroll in discussions</p>
              </div>
              <input
                type="checkbox"
                checked={formData.studentEnrollmentNotifications}
                onChange={() => handleToggle('studentEnrollmentNotifications')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Discussion Notifications</label>
                <p className="text-xs text-gray-500">Get notified about discussion updates</p>
              </div>
              <input
                type="checkbox"
                checked={formData.discussionNotifications}
                onChange={() => handleToggle('discussionNotifications')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Weekly Report</label>
                <p className="text-xs text-gray-500">Receive weekly summary reports</p>
              </div>
              <input
                type="checkbox"
                checked={formData.weeklyReport}
                onChange={() => handleToggle('weeklyReport')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Monthly Report</label>
                <p className="text-xs text-gray-500">Receive monthly summary reports</p>
              </div>
              <input
                type="checkbox"
                checked={formData.monthlyReport}
                onChange={() => handleToggle('monthlyReport')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}

export default Notifications

