import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { semestersService } from '../../../services/semestersService'
import Loader from '../../../components/Loader'
import { useToast } from '../../../contexts/ToastContext'

const SemesterForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      setFetching(true)
      semestersService.getById(id).then(res => {
        if (res.status && res.data) {
          setFormData({
            name: res.data.name || '',
            description: res.data.description || '',
          })
        }
        setFetching(false)
      }).catch(err => {
        console.error('Error fetching semester:', err)
        toast.error('Error fetching semester')
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
        description: formData.description || undefined,
      }

      let response
      if (isEdit) {
        response = await semestersService.update(id!, submitData)
      } else {
        response = await semestersService.create(submitData)
      }

      if (response.status) {
        toast.success(
          isEdit 
            ? `"${formData.name}" has been updated successfully.`
            : `"${formData.name}" has been created successfully.`
        )
        setTimeout(() => navigate('/master-data/semesters'), 1000)
      } else {
        toast.error(response.message || 'Failed to save semester')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error saving semester:', error)
      toast.error('Error saving semester')
      setLoading(false)
    }
  }

  if (fetching) {
    return <Loader fullScreen text="Loading semester..." />
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving semester..." />}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/master-data/semesters')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Semester' : 'Create Semester'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? 'Update semester information' : 'Add a new semester to the system'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
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
              placeholder="e.g., Semester 1, Fall Semester"
            />
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
              onClick={() => navigate('/master-data/semesters')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Semester' : 'Create Semester'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SemesterForm

