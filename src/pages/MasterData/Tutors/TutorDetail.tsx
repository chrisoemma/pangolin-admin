import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Users } from 'lucide-react'
import { tutorsService, type Tutor } from '../../../services/tutorsService'
import Loader from '../../../components/Loader'

const TutorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tutor, setTutor] = useState<Tutor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setLoading(true)
      tutorsService.getById(id).then(res => {
        if (res.status && res.data) {
          setTutor(res.data)
        }
        setLoading(false)
      }).catch(err => {
        console.error('Error fetching tutor:', err)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading tutor..." />
  }

  if (!tutor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Tutor not found</p>
          <button
            onClick={() => navigate('/master-data/tutors')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Tutors
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/master-data/tutors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
          <p className="text-gray-600 mt-2">Tutor Details</p>
        </div>
        <Link
          to={`/master-data/tutors/${tutor.id}/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tutor Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900 mt-1">{tutor.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900 mt-1">{tutor.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-gray-900 mt-1">{tutor.phone || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorDetail

