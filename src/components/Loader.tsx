interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  text?: string
}

const Loader = ({ size = 'md', fullScreen = false, text }: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}
          />
          <div
            className={`${sizeClasses[size]} rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0`}
          />
        </div>
        {text && (
          <p className="text-sm text-gray-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  )
}

export default Loader

