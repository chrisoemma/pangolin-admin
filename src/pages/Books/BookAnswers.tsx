import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, FileText, Download, Trash2 } from 'lucide-react'
import Loader from '../../components/Loader'

const BookAnswers = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [answerFile, setAnswerFile] = useState<File | null>(null)
  const [existingAnswer, setExistingAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // TODO: Fetch existing answer from API
    // setExistingAnswer(answerUrl)
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnswerFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!answerFile) return

    setLoading(true)
    try {
      // TODO: Replace with actual API call to upload PDF
      console.log('Uploading answer PDF:', answerFile.name)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setExistingAnswer(URL.createObjectURL(answerFile))
      setAnswerFile(null)
    } catch (error) {
      console.error('Error uploading answer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this answer?')) return

    setLoading(true)
    try {
      // TODO: Replace with actual API call to delete answer
      await new Promise(resolve => setTimeout(resolve, 500))
      setExistingAnswer(null)
    } catch (error) {
      console.error('Error deleting answer:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader fullScreen text="Processing..." />}
      <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/books')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Answers</h1>
          <p className="text-gray-600 mt-2">Upload and manage answer PDF for this book</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {existingAnswer ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <FileText className="text-primary" size={32} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Answer PDF Uploaded</p>
                <p className="text-sm text-gray-500">PDF file is ready for download</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={existingAnswer}
                  download
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  <Download size={18} />
                  Download
                </a>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="answerFile" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Answer PDF *
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload the answer key for this book in PDF format
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <label className="cursor-pointer">
                  <span className="text-primary font-medium hover:underline">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                  <input
                    type="file"
                    id="answerFile"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">PDF only, max 10MB</p>
                {answerFile && (
                  <p className="text-sm text-primary mt-2 font-medium">{answerFile.name}</p>
                )}
              </div>
            </div>

            {answerFile && (
              <div className="flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Upload size={18} />
                  {loading ? 'Uploading...' : 'Upload Answer'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default BookAnswers


