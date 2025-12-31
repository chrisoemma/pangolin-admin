import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Users } from 'lucide-react'
import { mockProfessors, type Professor } from '../../../data/mockData'
import Loader from '../../../components/Loader'

const ProfessorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch professor data from API
    setLoading(true)
    const foundProfessor = mockProfessors.find(p => p.id === id)
    if (foundProfessor) {
      setProfessor(foundProfessor)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading professor..." />
  }

  if (!professor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Professor not found</p>
          <button
            onClick={() => navigate('/master-data/professors')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Professors
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/master-data/professors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{professor.name}</h1>
          <p className="text-gray-600 mt-2">Professor Details</p>
        </div>
        <Link
          to={`/master-data/professors/${professor.id}/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Professor Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 mt-1">{professor.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900 mt-1">{professor.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-gray-900 mt-1">{professor.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Specialization</label>
              <p className="text-gray-900 mt-1">{professor.specialization}</p>
            </div>
            {professor.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900 mt-1">{professor.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Created Date</label>
              <p className="text-gray-900 mt-1">{new Date(professor.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessorDetail

