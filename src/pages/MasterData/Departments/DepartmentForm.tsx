import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { departmentsService} from '../../../services/departmentsService'
import { facultiesService } from '../../../services/facultiesService'
import Loader from '../../../components/Loader'
import { useToast } from '../../../contexts/ToastContext'

const DepartmentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    faculty_id: '',
    description: '',
  })

  const [faculties, setFaculties] = useState<Array<{ id: number; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    facultiesService.getAll().then(res => {
      if (res.status && res.data) {
        setFaculties(Array.isArray(res.data) ? res.data.map(f => ({ id: f.id, name: f.name })) : [])
      }
    })
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      setFetching(true)
      departmentsService.getById(id).then(res => {
        if (res.status && res.data) {
          setFormData({
            name: res.data.name || '',
            faculty_id: String(res.data.faculty_id),
            description: res.data.description || '',
          })
        }
        setFetching(false)
      }).catch(err => {
        console.error('Error fetching department:', err)
        toast.error('Error fetching department')
        setFetching(false)
      })
    }
  }, [id, isEdit, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData: any = {
        name: formData.name,
        faculty_id: Number(formData.faculty_id),
        description: formData.description || undefined,
      }

      let response
      if (isEdit) {
        response = await departmentsService.update(id!, submitData)
      } else {
        response = await departmentsService.create(submitData)
      }

      if (response.status) {
        toast.success(
          isEdit 
            ? `"${formData.name}" has been updated successfully.`
            : `"${formData.name}" has been created successfully.`
        )
        setTimeout(() => navigate('/master-data/departments'), 1000)
      } else {
        toast.error(response.message || 'Failed to save department')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error saving department:', error)
      toast.error('Error saving department')
      setLoading(false)
    }
  }

  if (fetching) {
    return <Loader fullScreen text="Loading department..." />
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving department..." />}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/master-data/departments')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Department' : 'Create Department'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? 'Update department information' : 'Add a new department to the system'}
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
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="faculty_id" className="block text-sm font-medium text-gray-700 mb-1">
                Faculty *
              </label>
              <select
                id="faculty_id"
                required
                value={formData.faculty_id}
                onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Faculty</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/master-data/departments')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Department' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default DepartmentForm

