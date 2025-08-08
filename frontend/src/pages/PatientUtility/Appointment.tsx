import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  User,
  Building2,
  Clock,
  FileText,
  AlertCircle,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability?: string[];
}

interface Department {
  id: string;
  name: string;
  consultation_fee: number;
}

interface FormData {
  doctor: string;
  department: string;
  date: string;
  reason: string;
  notes: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const INITIAL_FORM_STATE: FormData = {
  doctor: "",
  department: "",
  date: "",
  reason: "",
  notes: "",
};

// Mock data - replace with actual API calls
const mockDepartments: Department[] = [
  { id: "1", name: "Neurology", consultation_fee: 150 },
  { id: "2", name: "Cardiology", consultation_fee: 200 },
  { id: "3", name: "Orthopedics", consultation_fee: 175 },
  { id: "4", name: "General Medicine", consultation_fee: 100 },
  { id: "5", name: "Pediatrics", consultation_fee: 125 },
];

const mockDoctors: Doctor[] = [
  { id: "1", name: "Dr. Sarah Johnson", specialization: "Neurology" },
  { id: "2", name: "Dr. Michael Chen", specialization: "Neurology" },
  { id: "3", name: "Dr. Emily Rodriguez", specialization: "Cardiology" },
  { id: "4", name: "Dr. David Wilson", specialization: "Cardiology" },
  { id: "5", name: "Dr. Lisa Thompson", specialization: "Orthopedics" },
  { id: "6", name: "Dr. James Brown", specialization: "Orthopedics" },
  { id: "7", name: "Dr. Anna Davis", specialization: "General Medicine" },
  { id: "8", name: "Dr. Robert Miller", specialization: "Pediatrics" },
];

const BookAppointment: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Memoized filtered doctors based on selected department
  const filteredDoctors = useMemo(() => {
    if (!formData.department || !Array.isArray(doctors)) return [];

    const selectedDept = departments.find((d) => d.id === formData.department);
    if (!selectedDept) return doctors;

    return doctors.filter(
      (doctor) => doctor.specialization === selectedDept.name
    );
  }, [doctors, departments, formData.department]);

  // Selected department details
  const selectedDepartment = useMemo(() => {
    if (!Array.isArray(departments) || !formData.department) return null;
    return departments.find((d) => d.id === formData.department) || null;
  }, [departments, formData.department]);

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Fetch initial data (simulated with mock data)
  const fetchInitialData = useCallback(async () => {
    try {
      setInitialLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDoctors(mockDoctors);
      setDepartments(mockDepartments);
      setFeedback(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message: `Failed to load doctors or departments. Please refresh the page. ERROR - ${err}`,
      });
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Form field update handler
  const updateFormData = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        // Clear doctor selection if department changes
        if (field === "department" && prev.department !== value) {
          updated.doctor = "";
        }

        return updated;
      });

      // Clear feedback when user starts typing/selecting
      if (feedback) setFeedback(null);
    },
    [feedback]
  );

  // Form validation
  const validateForm = useCallback((): string | null => {
    if (!formData.doctor) return "Please select a doctor.";
    if (!formData.department) return "Please select a department.";
    if (!formData.date) return "Please select an appointment date.";
    if (!formData.reason.trim())
      return "Please provide a reason for your visit.";
    if (formData.reason.trim().length < 10)
      return "Reason must be at least 10 characters long.";

    // Check if date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "Please select a future date.";

    return null;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setFeedback({
        type: "success",
        message:
          "Appointment booked successfully! You will receive a confirmation email shortly.",
      });

      // Reset form
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        "Failed to book appointment. Please try again.";
      setFeedback({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setFeedback(null);
  };

  // Get minimum date for date input (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointment booking form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-white" />
                <h1 className="text-2xl font-bold text-white">
                  Book an Appointment
                </h1>
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset Form</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <p className="text-gray-600 mb-8">
              Fill out the form below to schedule your appointment. All fields
              marked with * are required.
            </p>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`mb-6 p-4 rounded-lg border-l-4 flex items-start space-x-3 ${
                  feedback.type === "error"
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "bg-green-50 border-green-500 text-green-700"
                }`}
              >
                {feedback.type === "error" ? (
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p>{feedback.message}</p>
                </div>
                <button
                  onClick={() => setFeedback(null)}
                  className="text-current hover:opacity-70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Selection */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Building2 className="h-4 w-4" />
                    <span>Select Department *</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      updateFormData("department", e.target.value)
                    }
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Choose a department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} - ${dept.consultation_fee}
                      </option>
                    ))}
                  </select>
                  {departments.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No departments available
                    </p>
                  )}
                </div>

                {/* Doctor Selection */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4" />
                    <span>Select Doctor *</span>
                  </label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => updateFormData("doctor", e.target.value)}
                    disabled={loading || !formData.department}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100"
                    required
                  >
                    <option value="">
                      {!formData.department
                        ? "Select department first"
                        : "Choose a doctor"}
                    </option>
                    {filteredDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                  {formData.department && filteredDoctors.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No doctors available for selected department
                    </p>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4" />
                    <span>Appointment Date *</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    min={getMinDate()}
                    onChange={(e) => updateFormData("date", e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100"
                    required
                  />
                  <p className="text-sm text-gray-500">Select a future date</p>
                </div>

                {/* Consultation Fee Display */}
                {selectedDepartment && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Consultation Fee
                    </label>
                    <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-lg font-semibold text-blue-600">
                        ${selectedDepartment.consultation_fee}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Reason for Visit */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  <span>Reason for Visit *</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => updateFormData("reason", e.target.value)}
                  disabled={loading}
                  maxLength={500}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 ${
                    formData.reason.length > 0 && formData.reason.length < 10
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  required
                />
                <div className="flex justify-between text-sm">
                  <span
                    className={`${
                      formData.reason.length > 0 && formData.reason.length < 10
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {formData.reason.length < 10 && formData.reason.length > 0
                      ? `Need ${10 - formData.reason.length} more characters`
                      : "Minimum 10 characters required"}
                  </span>
                  <span className="text-gray-500">
                    {formData.reason.length}/500
                  </span>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateFormData("notes", e.target.value)}
                  disabled={loading}
                  maxLength={1000}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100"
                  placeholder="Any additional information you'd like to share..."
                />
                <div className="text-right text-sm text-gray-500">
                  {formData.notes.length}/1000
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  )}
                  <span>{loading ? "Booking..." : "Book Appointment"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="flex-1 sm:flex-none bg-white text-gray-700 py-4 px-6 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
