import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { authorsService } from '../../../services/authorsService'
import Loader from '../../../components/Loader'
import { useToast } from '../../../contexts/ToastContext'

const AuthorForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      const fetchAuthor = async () => {
        setFetching(true)
        try {
          const response = await authorsService.getById(id)
          if (response.status && response.data) {
            const author = response.data
            setFormData({
              name: author.name || '',
              email: author.email || '',
              bio: author.bio || '',
            })
          }
        } catch (error) {
          console.error('Error fetching author:', error)
          toast.error('Failed to load author data')
        } finally {
          setFetching(false)
        }
      }
      fetchAuthor()
    }
  }, [id, isEdit, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData: any = {
        name: formData.name,
        ...(formData.email && { email: formData.email }),
        ...(formData.bio && { bio: formData.bio }),
      }

      let response
      if (isEdit) {
        response = await authorsService.update(id!, submitData)
      } else {
        response = await authorsService.create(submitData)
      }

      if (response.status) {
        toast.success(
          isEdit 
            ? `"${formData.name}" has been updated successfully.`
            : `"${formData.name}" has been created successfully.`
        )
        setTimeout(() => navigate('/master-data/authors'), 1000)
      } else {
        toast.error(response.message || 'Failed to save author')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error saving author:', error)
      toast.error('Error saving author')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (fetching) {
    return <Loader fullScreen text="Loading author..." />
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving author..." />}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/master-data/authors')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Author' : 'Add New Author'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? 'Update author information' : 'Add a new author to the system'}
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
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Enter author biography..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/master-data/authors')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Author' : 'Create Author'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AuthorForm

