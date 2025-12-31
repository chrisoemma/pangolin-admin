import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Database } from 'lucide-react'
import { mockCategories, type Category } from '../../../data/mockData'
import Loader from '../../../components/Loader'

const CategoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch category data from API
    setLoading(true)
    const foundCategory = mockCategories.find(c => c.id === id)
    if (foundCategory) {
      setCategory(foundCategory)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading category..." />
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Database className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Category not found</p>
          <button
            onClick={() => navigate('/master-data/categories')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Categories
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/master-data/categories')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600 mt-2">Category Details</p>
        </div>
        <Link
          to={`/master-data/categories/${category.id}/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900 mt-1">{category.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900 mt-1">{category.description}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Created Date</label>
            <p className="text-gray-900 mt-1">{new Date(category.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryDetail

