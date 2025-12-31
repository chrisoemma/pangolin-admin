import { AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react'

export type ConfirmationType = 'danger' | 'warning' | 'success' | 'info'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  type?: ConfirmationType
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  showCancel?: boolean
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText,
  cancelText = 'Cancel',
  isLoading = false,
  showCancel = true,
}: ConfirmationModalProps) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="text-red-600" size={24} />
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={24} />
      case 'success':
        return <CheckCircle className="text-green-600" size={24} />
      case 'info':
      default:
        return <Info className="text-blue-600" size={24} />
    }
  }

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
      case 'info':
      default:
        return 'bg-primary hover:bg-primary/90 focus:ring-primary'
    }
  }

  const getDefaultConfirmText = () => {
    switch (type) {
      case 'danger':
        return 'Delete'
      case 'warning':
        return 'Continue'
      case 'success':
        return 'OK'
      case 'info':
      default:
        return 'Confirm'
    }
  }

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={!isLoading ? onClose : undefined}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                type === 'danger' ? 'bg-red-100' :
                type === 'warning' ? 'bg-yellow-100' :
                type === 'success' ? 'bg-green-100' :
                'bg-blue-100'
              } sm:mx-0 sm:h-10 sm:w-10`}>
                {getIcon()}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 whitespace-pre-line">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed ${getConfirmButtonColor()}`}
            >
              {isLoading ? 'Processing...' : (confirmText || getDefaultConfirmText())}
            </button>
            {showCancel && (
              <button
                onClick={onClose}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

