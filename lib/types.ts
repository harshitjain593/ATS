export type UserRole = "admin" | "recruiter" | "candidate"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Internship"
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  status: "Open" | "Closed" | "Draft" | "PendingApproval" | "Rejected"
  postedDate: string
  applicants: string[] // Array of candidate IDs
  applicationStatus?: string[] // Array of application statuses from API
}

export interface Candidate {
  id: string
  name: string
  applicationEmail: string
  phone?: string
  status: "New" | "Reviewed" | "AI Screening" | "Interviewing" | "Offered" | "Hired" | "Rejected"
  skills: string[]
  experience: {
    title: string
    company: string
    years: number
    description?: string
  }[]
  education: {
    degree: string
    institution: string
    year: number
  }[]
  notes?: string
  appliedJobs: { jobId: string; matchScore: number; jobTitle?: string }[] // New structure
  offers?: string[] // Array of job IDs for which the candidate has offers
}

export interface Interview {
  id: string
  candidateId: string
  jobId: string
  date: string
  time: string
  duration: number // Duration in minutes
  interviewer: string
  interviewerEmail?: string
  interviewerPhone?: string
  status: "Scheduled" | "Completed" | "Canceled" | "Rescheduled"
  feedback?: string
  score?: number
  type: "virtual" | "ai" | "on-site" | "phone"
  interviewMode: "human" | "ai"
  location?: string // For on-site interviews
  meetingLink?: string // For virtual interviews
  notes?: string
  requirements?: string[] // Job requirements for AI questions
  aiQuestions?: string[] // AI-generated questions
  candidateName?: string // For display purposes
  jobTitle?: string // For display purposes
  companyName?: string // For display purposes
  createdDate?: string
  modifiedDate?: string
}

export interface Offer {
  id: string
  candidateId: string
  jobId: string
  salary: number
  status: "Pending" | "Accepted" | "Rejected" | "Withdrawn"
  // API response fields
  name?: string // Candidate name from API
  companyName?: string // Company name from API
  // Additional offer letter details
  candidateName?: string
  candidateEmail?: string
  candidatePhone?: string
  candidateAddress?: string
  jobTitle?: string
  department?: string
  location?: string
  jobType?: "Full-time" | "Part-time" | "Contract" | "Internship"
  baseSalary?: number
  bonus?: number
  benefits?: string[]
  equity?: string
  startDate?: string
  reportingTo?: string
  workSchedule?: string
  probationPeriod?: string
  noticePeriod?: string
  terminationClause?: string
  confidentialityClause?: string
  nonCompeteClause?: string
  intellectualPropertyClause?: string
  offerExpiryDate?: string
  acceptanceDeadline?: string
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
  termsAndConditions?: string[]
  createdBy?: string
  createdDate?: string
  modifiedBy?: string
  modifiedDate?: string
}

export interface Application {
  firstName: string,
  lastName: string,
  id: number;
  jobId: number;
  userId: number;
  status: string;
  resume: string;
  coverLetter: string;
  createdBy: number;
  createdDate: string | null;
  modifiedBy: number | null;
  modifiedDate: string | null;
  mobile: string;
  // Additional fields from API response
  name?: string;
  applicationEmail?: string;
  skills?: string[];
  experience?: string;
  previousPosition?: string;
  companyName?: string;
  education?: string[];
  jobTitle?: string;
  resumeScore?: number;
}

export interface UserRoleApi {
  userId: number;
  roleId: number;
  roleName: string;
  isActive: boolean;
}

export interface UserApi {
  userId: number;
  roleId: number;
  roleList: UserRoleApi[];
  userName: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  dob: string;
  password: string;
  address: string;
  city: string;
  flag: string;
  state: string;
  pinCode: string;
  userType: string;
  userStatus: string;
  panCardNo: string;
  filePath: string;
  isActive: boolean;
  createdBy: number;
  skills?: string; // Add skills as optional
  role?: string;
}

export interface AuthRequest {
  mobileOrEmail: string;
  password: string;
  verificationCode: string;
  isResendOTP: boolean;
}

export interface AuthResponse {
  code: number;
  msg: string;
  data: UserApi | null;
}

// Candidate Pipeline API response type (update as needed)
export interface CandidatePipelineResponse {
  name: string;
  email: string;
  phone: string;
  linkedIn: string | null;
  location: string;
  currentTitle: string;
  company: string;
  experienceYears: number;
  education: string[];
  certifications: string[];
  skills: string[];
  skillGap: string[];
  strengths: string[];
  weaknesses: string[];
  careerGap: string[];
  noticePeriod: string | null;
  score: number;
  fakenessIndicators: string[];
  aiFit: {
    fit: string;
    reason: string;
  };
}

export interface Stage {
  id: string
  name: string
  description?: string
  order: number
  color?: string
  jobId: string
  isActive: boolean
  createdDate: string
  modifiedDate?: string
}
