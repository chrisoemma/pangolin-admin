import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { booksService } from '../../services/booksService'
import { masterDataService, type Topic } from '../../services/masterDataService'
import { authorsService, type Author } from '../../services/authorsService'
import { useToast } from '../../contexts/ToastContext'
import Loader from '../../components/Loader'

const BookForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    topic: '',
    description: '',
    hardCopyPrice: '',
    softCopyAvailable: false,
    softCopyPrice: '',
    coverImage: null as File | null,
    softCopyPdf: null as File | null,
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true)
      try {
        // Fetch topics and authors in parallel
        const [topicsResponse, authorsResponse, bookResponse] = await Promise.all([
          masterDataService.getTopics(),
          authorsService.getAll(),
          isEdit && id ? booksService.getById(id) : Promise.resolve({ status: false } as any),
        ])

        if (topicsResponse.status && topicsResponse.data) {
          setTopics(Array.isArray(topicsResponse.data) ? topicsResponse.data : [])
        }

        if (authorsResponse.status && authorsResponse.data) {
          setAuthors(Array.isArray(authorsResponse.data) ? authorsResponse.data : [])
        }

        if (bookResponse.status && bookResponse.data) {
          const book = bookResponse.data
          setFormData(prev => ({
            ...prev,
            title: book.title || '',
            author: book.author || '',
            topic: book.topic || '',
            description: book.description || '',
            hardCopyPrice: book.hardCopyPrice?.toString() || '',
            softCopyAvailable: book.softCopyAvailable || false,
            softCopyPrice: book.softCopyPrice?.toString() || '',
            coverImage: null,
            softCopyPdf: null,
          }))
        }
      } catch (error) {
        console.error('Error loading form data:', error)
        toast.error('Failed to load form data')
      } finally {
        setFetching(false)
      }
    }

    fetchData()
  }, [id, isEdit, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        title: formData.title,
        author: formData.author,
        topic: formData.topic,
        description: formData.description || undefined,
        hardCopyPrice: parseFloat(formData.hardCopyPrice),
        softCopyAvailable: formData.softCopyAvailable,
        softCopyPrice: formData.softCopyAvailable && formData.softCopyPrice 
          ? parseFloat(formData.softCopyPrice) 
          : undefined,
        coverImage: formData.coverImage,
        softCopyPdf: formData.softCopyPdf,
      }

      let response
      if (isEdit) {
        response = await booksService.update(id!, submitData)
      } else {
        response = await booksService.create(submitData)
      }

      if (response.status) {
        toast.success(
          isEdit 
            ? `"${formData.title}" has been updated successfully.`
            : `"${formData.title}" has been created successfully.`
        )
        setTimeout(() => navigate('/books'), 1000)
      } else {
        toast.error(response.message || 'Failed to save book')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error saving book:', error)
      toast.error('Error saving book')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, coverImage: e.target.files![0] }))
    }
  }

  if (fetching) {
    return <Loader fullScreen text="Loading book..." />
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving book..." />}
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/books')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Book' : 'Add New Book'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update book information' : 'Add a new book to the library'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <select
              id="author"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="">Select an author</option>
              {authors.map(author => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Manage authors in Master Data &gt; Authors.
            </p>
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Topic *
            </label>
            <select
              id="topic"
              name="topic"
              required
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="">Select a topic</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.name}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="hardCopyPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Hard Copy Price *
            </label>
            <input
              type="number"
              id="hardCopyPrice"
              name="hardCopyPrice"
              required
              min="0"
              step="0.01"
              value={formData.hardCopyPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="softCopyAvailable"
              name="softCopyAvailable"
              checked={formData.softCopyAvailable}
              onChange={(e) => setFormData(prev => ({ ...prev, softCopyAvailable: e.target.checked }))}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="softCopyAvailable" className="ml-2 text-sm font-medium text-gray-700">
              Available in Soft Copy (PDF)
            </label>
          </div>

          {formData.softCopyAvailable && (
            <div>
              <label htmlFor="softCopyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Soft Copy Price *
              </label>
              <input
                type="number"
                id="softCopyPrice"
                name="softCopyPrice"
                required={formData.softCopyAvailable}
                min="0"
                step="0.01"
                value={formData.softCopyPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image *
            </label>
            <div className="mt-1 flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                <Upload size={20} />
                Upload Cover Image
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {formData.coverImage && (
                <span className="text-sm text-gray-600">{formData.coverImage.name}</span>
              )}
            </div>
          </div>

          {formData.softCopyAvailable && (
            <div>
              <label htmlFor="softCopyPdf" className="block text-sm font-medium text-gray-700 mb-1">
                Soft Copy PDF *
              </label>
              <div className="mt-1 flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                  <Upload size={20} />
                  Upload PDF
                  <input
                    type="file"
                    id="softCopyPdf"
                    name="softCopyPdf"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData(prev => ({ ...prev, softCopyPdf: e.target.files![0] }))
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {formData.softCopyPdf && (
                  <span className="text-sm text-gray-600">{formData.softCopyPdf.name}</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Create Book'}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}

export default BookForm

