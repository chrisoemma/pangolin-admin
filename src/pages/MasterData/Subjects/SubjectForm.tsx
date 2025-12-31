import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { subjectsService, type Subject } from '../../../services/subjectsService'
import { departmentsService } from '../../../services/departmentsService'
import { semestersService } from '../../../services/semestersService'
import { yearOfStudyService } from '../../../services/yearOfStudyService'
import Loader from '../../../components/Loader'
import { useToast } from '../../../contexts/ToastContext'

const SubjectForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department_id: '',
    semester_id: '',
    year_of_study_id: '',
    description: '',
  })

  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([])
  const [semesters, setSemesters] = useState<Array<{ id: number; name: string }>>([])
  const [yearsOfStudy, setYearsOfStudy] = useState<Array<{ id: number; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    Promise.all([
      departmentsService.getAll().then(res => {
        if (res.status && res.data) {
          setDepartments(Array.isArray(res.data) ? res.data.map(d => ({ id: d.id, name: d.name })) : [])
        }
      }),
      semestersService.getAll().then(res => {
        if (res.status && res.data) {
          setSemesters(Array.isArray(res.data) ? res.data.map(s => ({ id: s.id, name: s.name })) : [])
        }
      }),
      yearOfStudyService.getAll().then(res => {
        if (res.status && res.data) {
          setYearsOfStudy(Array.isArray(res.data) ? res.data.map(y => ({ id: y.id, name: y.name })) : [])
        }
      }),
    ])
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      setFetching(true)
      subjectsService.getById(id).then(res => {
        if (res.status && res.data) {
          setFormData({
            name: res.data.name || '',
            code: res.data.code || '',
            department_id: String(res.data.department_id),
            semester_id: res.data.semester_id ? String(res.data.semester_id) : '',
            year_of_study_id: res.data.year_of_study_id ? String(res.data.year_of_study_id) : '',
            description: res.data.description || '',
          })
        }
        setFetching(false)
      }).catch(err => {
        console.error('Error fetching subject:', err)
        toast.error('Error fetching subject')
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
        code: formData.code || undefined,
        department_id: Number(formData.department_id),
        description: formData.description || undefined,
      }
      if (formData.semester_id) {
        submitData.semester_id = Number(formData.semester_id)
      }
      if (formData.year_of_study_id) {
        submitData.year_of_study_id = Number(formData.year_of_study_id)
      }

      let response
      if (isEdit) {
        response = await subjectsService.update(id!, submitData)
      } else {
        response = await subjectsService.create(submitData)
      }

      if (response.status) {
        toast.success(
          isEdit 
            ? `"${formData.name}" has been updated successfully.`
            : `"${formData.name}" has been created successfully.`
        )
        setTimeout(() => navigate('/master-data/subjects'), 1000)
      } else {
        toast.error(response.message || 'Failed to save subject')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error saving subject:', error)
      toast.error('Error saving subject')
      setLoading(false)
    }
  }

  if (fetching) {
    return <Loader fullScreen text="Loading subject..." />
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving subject..." />}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/master-data/subjects')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Subject' : 'Create Subject'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? 'Update subject information' : 'Add a new subject to the system'}
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
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
              <input
                type="text"
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., CS101, MATH201"
              />
            </div>

            <div>
              <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                id="department_id"
                required
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="semester_id" className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                id="semester_id"
                value={formData.semester_id}
                onChange={(e) => setFormData({ ...formData, semester_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>{semester.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year_of_study_id" className="block text-sm font-medium text-gray-700 mb-1">
                Year of Study
              </label>
              <select
                id="year_of_study_id"
                value={formData.year_of_study_id}
                onChange={(e) => setFormData({ ...formData, year_of_study_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Year of Study</option>
                {yearsOfStudy.map(year => (
                  <option key={year.id} value={year.id}>{year.name}</option>
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
              onClick={() => navigate('/master-data/subjects')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SubjectForm

