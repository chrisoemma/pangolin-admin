import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { topicsService, type Topic } from '../../../services/topicsService'
import { subjectsService } from '../../../services/subjectsService'
import Loader from '../../../components/Loader'
import { useToast } from '../../../contexts/ToastContext'

interface SubtopicData {
  id?: number
  name?: string
  description?: string
  order?: number
  is_active?: boolean
}

const TopicForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    subject_id: '',
    description: '',
  })

  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  // Subtopics management
  const [subtopics, setSubtopics] = useState<SubtopicData[]>([])
  const [availableSubtopics, setAvailableSubtopics] = useState<Array<{ id: number; name: string; description?: string }>>([])

  // Fetch subjects on mount
  useEffect(() => {
    subjectsService.getAll().then(res => {
      if (res.status && res.data) {
        setSubjects(Array.isArray(res.data) ? res.data.map(s => ({ id: s.id, name: s.name })) : [])
      }
    })
  }, [])

  // Fetch available subtopics when subject changes (for selecting existing subtopics from same subject)
  useEffect(() => {
    if (formData.subject_id) {
      // Fetch all topics for this subject to get their subtopics
      topicsService.getAll({ subject_id: formData.subject_id }).then(res => {
        if (res.status && res.data) {
          const allSubtopics: Array<{ id: number; name: string; description?: string }> = []
          res.data.forEach((topic: any) => {
            if (topic.subtopics && Array.isArray(topic.subtopics)) {
              topic.subtopics.forEach((st: any) => {
                allSubtopics.push({
                  id: st.id,
                  name: st.name,
                  description: st.description,
                })
              })
            }
          })
          setAvailableSubtopics(allSubtopics)
        }
      })
    } else {
      setAvailableSubtopics([])
    }
  }, [formData.subject_id])

  // Fetch topic data for edit
  useEffect(() => {
    if (isEdit && id) {
      setFetching(true)
      topicsService.getById(id).then(res => {
        if (res.status && res.data) {
          setFormData({
            name: res.data.name || '',
            subject_id: String(res.data.subject_id),
            description: res.data.description || '',
          })

          // Set existing subtopics
          if (res.data.subtopics && Array.isArray(res.data.subtopics)) {
            setSubtopics(res.data.subtopics.map((st: any) => ({
              id: st.id,
              name: st.name,
              description: st.description,
              order: st.order,
              is_active: st.is_active,
            })))
          }
        }
        setFetching(false)
      }).catch(err => {
        console.error('Error fetching topic:', err)
        toast.error('Error fetching topic')
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
        subject_id: Number(formData.subject_id),
        description: formData.description || undefined,
      }

      // Include subtopics if any
      if (subtopics.length > 0) {
        submitData.subtopics = subtopics.map((st, index) => ({
          ...(st.id ? { id: st.id } : {}),
          ...(st.name ? { name: st.name } : {}),
          ...(st.description ? { description: st.description } : {}),
          order: st.order ?? index,
          is_active: st.is_active ?? true,
        }))
      }

      let response
      if (isEdit) {
        response = await topicsService.update(id!, submitData)
      } else {
        response = await topicsService.create(submitData)
      }

      if (response.status) {
        toast.success(
          isEdit 
            ? `"${formData.name}" has been updated successfully.`
            : `"${formData.name}" has been created successfully.`
        )
        setTimeout(() => navigate('/master-data/topics'), 1000)
      } else {
        toast.error(response.message || 'Failed to save topic')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error saving topic:', error)
      toast.error('Error saving topic')
      setLoading(false)
    }
  }

  const addSubtopic = () => {
    setSubtopics([...subtopics, { name: '', description: '', is_active: true }])
  }

  const removeSubtopic = (index: number) => {
    setSubtopics(subtopics.filter((_, i) => i !== index))
  }

  const updateSubtopic = (index: number, field: string, value: any) => {
    const updated = [...subtopics]
    updated[index] = { ...updated[index], [field]: value }
    setSubtopics(updated)
  }

  const selectExistingSubtopic = (index: number, subtopicId: number) => {
    const subtopic = availableSubtopics.find(st => st.id === subtopicId)
    if (subtopic) {
      const updated = [...subtopics]
      updated[index] = { 
        id: subtopic.id, 
        name: subtopic.name, 
        description: subtopic.description,
        is_active: true 
      }
      setSubtopics(updated)
    }
  }

  const clearSubtopicSelection = (index: number) => {
    const updated = [...subtopics]
    updated[index] = { name: '', description: '', is_active: true }
    setSubtopics(updated)
  }

  if (fetching) {
    return <Loader fullScreen text="Loading topic..." />
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving topic..." />}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/master-data/topics')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Topic' : 'Create Topic'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? 'Update topic information' : 'Add a new topic to the system'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Topic Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Calculus, Thermodynamics"
              />
            </div>

            <div>
              <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                id="subject_id"
                required
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
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
              placeholder="Describe the topic..."
            />
          </div>

          {/* Subtopics Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Subtopics</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add subtopics by selecting existing ones or creating new ones
                </p>
              </div>
              <button
                type="button"
                onClick={addSubtopic}
                className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Subtopic
              </button>
            </div>

            {subtopics.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600">No subtopics added yet</p>
                <p className="text-sm text-gray-500 mt-1">Click "Add Subtopic" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subtopics.map((subtopic, index) => (
                  <div key={index} className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex-1 space-y-4">
                      {/* Option to select existing subtopic */}
                      {formData.subject_id && availableSubtopics.length > 0 && !subtopic.id && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Existing Subtopic (Optional)
                          </label>
                          <div className="flex gap-2">
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  selectExistingSubtopic(index, Number(e.target.value))
                                }
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value="">Choose from existing subtopics...</option>
                              {availableSubtopics
                                .filter(st => !subtopics.some(s => s.id === st.id))
                                .map(st => (
                                  <option key={st.id} value={st.id}>
                                    {st.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Or create a new subtopic below
                          </p>
                        </div>
                      )}

                      {/* Display selected existing subtopic */}
                      {subtopic.id && (
                        <div className="p-3 bg-white border border-primary/20 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                  Existing
                                </span>
                                <p className="font-medium text-gray-900">{subtopic.name}</p>
                              </div>
                              {subtopic.description && (
                                <p className="text-sm text-gray-600 mt-1">{subtopic.description}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => clearSubtopicSelection(index)}
                              className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Create new subtopic fields */}
                      {!subtopic.id && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subtopic Name *
                            </label>
                            <input
                              type="text"
                              value={subtopic.name || ''}
                              onChange={(e) => updateSubtopic(index, 'name', e.target.value)}
                              required={!subtopic.id}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="e.g., Limits, Derivatives"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={subtopic.description || ''}
                              onChange={(e) => updateSubtopic(index, 'description', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Brief description..."
                            />
                          </div>
                        </div>
                      )}

                      {/* Additional options for new subtopics */}
                      {!subtopic.id && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Order (Optional)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={subtopic.order ?? ''}
                              onChange={(e) => updateSubtopic(index, 'order', e.target.value ? Number(e.target.value) : undefined)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder={`Default: ${index}`}
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={subtopic.is_active ?? true}
                                onChange={(e) => updateSubtopic(index, 'is_active', e.target.checked)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeSubtopic(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove subtopic"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/master-data/topics')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Topic' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default TopicForm