import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Database } from 'lucide-react'
import { subjectsService, type Subject } from '../../../services/subjectsService'
import Loader from '../../../components/Loader'

const SubjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setLoading(true)
      subjectsService.getById(id).then(res => {
        if (res.status && res.data) {
          setSubject(res.data)
        }
        setLoading(false)
      }).catch(err => {
        console.error('Error fetching subject:', err)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading subject..." />
  }

  if (!subject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Database className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Subject not found</p>
          <button
            onClick={() => navigate('/master-data/subjects')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Subjects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/master-data/subjects')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
          <p className="text-gray-600 mt-2">Subject Details</p>
        </div>
        <Link
          to={`/master-data/subjects/${subject.id}/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900 mt-1">{subject.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Code</label>
            <p className="text-gray-900 mt-1">{subject.code || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Department</label>
            <p className="text-gray-900 mt-1">{subject.department?.name || subject.department_id || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Semester</label>
            <p className="text-gray-900 mt-1">{subject.semester?.name || subject.semester_id || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Year of Study</label>
            <p className="text-gray-900 mt-1">{subject.year_of_study?.name || subject.year_of_study_id || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900 mt-1">{subject.description || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectDetail

