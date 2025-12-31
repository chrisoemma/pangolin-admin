import { useState } from 'react'
import { Save, Settings } from 'lucide-react'
import Loader from '../../components/Loader'

const SystemConfiguration = () => {
  const [formData, setFormData] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxFileUploadSize: '10',
    sessionTimeout: '30',
    enableApiAccess: true,
    enableLogging: true,
    logLevel: 'info',
    backupFrequency: 'daily',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      console.log('Saving system configuration:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('System configuration saved successfully!')
    } catch (error) {
      console.error('Error saving configuration:', error)
      alert('Error saving configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }))
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving configuration..." />}
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
        <p className="text-gray-600 mt-2">Manage system-wide configuration settings</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings size={20} />
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Maintenance Mode</label>
                <p className="text-xs text-gray-500">Put the system in maintenance mode</p>
              </div>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Allow Registration</label>
                <p className="text-xs text-gray-500">Allow new user registrations</p>
              </div>
              <input
                type="checkbox"
                name="allowRegistration"
                checked={formData.allowRegistration}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Require Email Verification</label>
                <p className="text-xs text-gray-500">Require users to verify their email</p>
              </div>
              <input
                type="checkbox"
                name="requireEmailVerification"
                checked={formData.requireEmailVerification}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="maxFileUploadSize" className="block text-sm font-medium text-gray-700 mb-1">
                Max File Upload Size (MB) *
              </label>
              <input
                type="number"
                id="maxFileUploadSize"
                name="maxFileUploadSize"
                required
                min="1"
                value={formData.maxFileUploadSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes) *
              </label>
              <input
                type="number"
                id="sessionTimeout"
                name="sessionTimeout"
                required
                min="5"
                value={formData.sessionTimeout}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API & Logging</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Enable API Access</label>
                <p className="text-xs text-gray-500">Allow API access to the system</p>
              </div>
              <input
                type="checkbox"
                name="enableApiAccess"
                checked={formData.enableApiAccess}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-900">Enable Logging</label>
                <p className="text-xs text-gray-500">Enable system logging</p>
              </div>
              <input
                type="checkbox"
                name="enableLogging"
                checked={formData.enableLogging}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>

            {formData.enableLogging && (
              <div>
                <label htmlFor="logLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Log Level *
                </label>
                <select
                  id="logLevel"
                  name="logLevel"
                  required
                  value={formData.logLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Backup Settings</h2>
          <div>
            <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-1">
              Backup Frequency *
            </label>
            <select
              id="backupFrequency"
              name="backupFrequency"
              required
              value={formData.backupFrequency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}

export default SystemConfiguration

