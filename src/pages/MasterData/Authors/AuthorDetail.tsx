import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, BookOpen, Mail, FileText, Calendar } from 'lucide-react'
import { authorsService, type Author } from '../../../services/authorsService'
import Loader from '../../../components/Loader'
import { useToast } from '../../../contexts/ToastContext'

const AuthorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setLoading(true)
      authorsService.getById(id).then(res => {
        if (res.status && res.data) {
          setAuthor(res.data)
        } else {
          toast.error('Failed to fetch author')
        }
        setLoading(false)
      }).catch(err => {
        console.error('Error fetching author:', err)
        toast.error('Error fetching author')
        setLoading(false)
      })
    }
  }, [id, toast])

  if (loading) {
    return <Loader fullScreen text="Loading author..." />
  }

  if (!author) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Author not found</p>
          <button
            onClick={() => navigate('/master-data/authors')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Authors
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/master-data/authors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
          <p className="text-gray-600 mt-2">Author Details</p>
        </div>
        <Link
          to={`/master-data/authors/${author.id}/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Edit Author
        </Link>
      </div>

      {/* Author Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Author Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Author Name</label>
            <p className="text-gray-900 mt-1 font-medium">{author.name}</p>
          </div>

          {author.email && (
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="mt-1 flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p className="text-gray-900">{author.email}</p>
              </div>
            </div>
          )}

          {author.bio && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Biography</label>
              <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">{author.bio}</p>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Created Date</label>
            <div className="mt-1 flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <p className="text-gray-900">
                {author.created_at ? new Date(author.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Last Updated</label>
            <div className="mt-1 flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <p className="text-gray-900">
                {author.updated_at ? new Date(author.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Author Name</p>
              <p className="text-lg font-bold text-gray-900 truncate">{author.name}</p>
            </div>
          </div>
        </div>

        {author.email && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{author.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Biography</p>
              <p className="text-sm font-medium text-gray-900">
                {author.bio ? 'Available' : 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorDetail

