import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Database } from 'lucide-react'
import { yearOfStudyService, type YearOfStudy } from '../../../services/yearOfStudyService'
import Loader from '../../../components/Loader'

const YearOfStudyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [year, setYear] = useState<YearOfStudy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setLoading(true)
      yearOfStudyService.getById(id).then(res => {
        if (res.status && res.data) {
          setYear(res.data)
        }
        setLoading(false)
      }).catch(err => {
        console.error('Error fetching year of study:', err)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading year of study..." />
  }

  if (!year) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Database className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Year of study not found</p>
          <button
            onClick={() => navigate('/master-data/year-of-study')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Years of Study
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/master-data/year-of-study')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{year.name}</h1>
          <p className="text-gray-600 mt-2">Year of Study Details</p>
        </div>
        <Link
          to={`/master-data/year-of-study/${year.id}/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Year of Study Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900 mt-1">{year.name}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900 mt-1">{year.description || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YearOfStudyDetail

