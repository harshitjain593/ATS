import { createAsyncThunk } from '@reduxjs/toolkit';
import { Job, Application } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function mapApiJobToJob(apiJob: any): Job {
  console.log('Mapping API job:', apiJob);
  
  // Determine job type with proper typing
  let jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  if (apiJob.jobType === 'FullTime' || apiJob.jobType === 'Full-Time' || apiJob.jobType === 'full-time') {
    jobType = 'Full-time';
  } else if (apiJob.jobType === 'PartTime' || apiJob.jobType === 'Part-Time' || apiJob.jobType === 'part-time') {
    jobType = 'Part-time';
  } else if (apiJob.jobType === 'Contract') {
    jobType = 'Contract';
  } else if (apiJob.jobType === 'Internship') {
    jobType = 'Internship';
  } else {
    jobType = 'Full-time'; // Default
  }
  
  const mappedJob: Job = {
    id: String(apiJob.jobId || apiJob.id),
    title: apiJob.title,
    company: apiJob.companyName || apiJob.company,
    location: apiJob.location,
    type: jobType,
    salary:
      apiJob.maxSalary && apiJob.minSalary
        ? `${apiJob.minSalary} - ${apiJob.maxSalary} ${apiJob.salaryCurrency || ''}`
        : '',
    description: apiJob.description,
    requirements: typeof apiJob.requirements === 'string' ? apiJob.requirements.split(',').map((s: string) => s.trim()) : [],
    responsibilities: typeof apiJob.responsibilities === 'string' ? apiJob.responsibilities.split(',').map((s: string) => s.trim()) : [],
    status:
      apiJob.status === 'OPEN' || apiJob.status === 'Open'
        ? 'Open'
        : apiJob.status === 'CLOSED' || apiJob.status === 'Closed'
        ? 'Closed'
        : apiJob.status === 'Draft'
        ? 'Draft'
        : apiJob.status === 'PendingApproval' || apiJob.status === 'PENDINGAPPROVAL' || apiJob.status === 'PendingApp' || apiJob.status === 'PENDINGAPP'
        ? 'PendingApproval'
        : apiJob.status === 'Rejected' || apiJob.status === 'REJECTED'
        ? 'Rejected'
        : 'Draft',
    postedDate: apiJob.createdDate || '',
    applicants: Array(apiJob.applicationCount || 0).fill(''), // Create array with length equal to applicationCount
    applicationStatus: apiJob.applicationStatus || [], // Add the application status array
  };
  
  console.log('Mapped job result:', mappedJob);
  return mappedJob;
}

export const fetchJobs = createAsyncThunk<Job[]>(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/job/getAllJobs`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResult = await response.json();
      console.log('fetchJobs API response:', apiResult);
      
      // Check if the response has the expected structure
      if (!apiResult.data) {
        console.error('API response missing data property:', apiResult);
        return [];
      }
      
      // Handle different possible response structures
      let jobsData = apiResult.data;
      if (Array.isArray(jobsData)) {
        // Direct array of jobs
        const jobs = jobsData.map(mapApiJobToJob);
        console.log('Mapped jobs:', jobs);
        return jobs;
      } else if (jobsData.jobs && Array.isArray(jobsData.jobs)) {
        // Nested jobs array
        const jobs = jobsData.jobs.map(mapApiJobToJob);
        console.log('Mapped jobs from nested structure:', jobs);
        return jobs;
      } else if (typeof jobsData === 'object' && jobsData !== null) {
        // Single job object or other structure
        console.log('Unexpected data structure:', jobsData);
        return [];
      } else {
        console.log('No jobs data found in response');
        return [];
      }
    } catch (error: any) {
      console.error('fetchJobs error:', error);
      return rejectWithValue(error.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk<{ job: Job, applications: Application[], userAppliedJobs?: any[] }, string>(
  'jobs/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/job/getjobbyid?jobId=${jobId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResult = await response.json();
      
      // The job data is nested under `data.job`
      if (apiResult.data && apiResult.data.job) {
        const job = mapApiJobToJob(apiResult.data.job);
        const applications = apiResult.data.applications || [];
        const userAppliedJobs = apiResult.data.userAppliedJobs || [];
        // The applications are in `data.applications`
        if (Array.isArray(apiResult.data.applications)) {
          // Extract user IDs to match the `Job.applicants` type (string[])
          job.applicants = applications.map((app: any) => String(app.userId));
        }
        
        return { job, applications, userAppliedJobs };
      }
      throw new Error('Job not found');
    } catch (error: any) {
      console.error('fetchJobById error:', error);
      return rejectWithValue(error.message || 'Failed to fetch job');
    }
  }
);

export const createJob = createAsyncThunk<Job, any>(
  'jobs/createJob',
  async (jobData) => {
    const body = {
      "jobId": 0,
      title: jobData.title,
      description: jobData.description,
      requirements: Array.isArray(jobData.requirements) ? jobData.requirements.join(', ') : jobData.requirements,
      responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities.join(', ') : jobData.responsibilities,
      salaryCurrency: jobData.salaryCurrency,
      isApproved: jobData.isApproved,
      experience: jobData.experience,
      status: jobData.status,
      postedById: "1",
      skills: jobData.skills,
      benefits: jobData.benefits,
      deadLine: jobData.deadLine ? new Date(jobData.deadLine).toISOString() : null,
      flag: "C",
      companyName: jobData.companyName || jobData.company,
      location: jobData.location,
      isRemote: jobData.isRemote,
      jobType: jobData.jobType,
      maxSalary: jobData.maxSalary,
      minSalary: jobData.minSalary,
      createdBy: "1",
      createdDate: new Date().toISOString(),
      modifiedBy: "1",
      modifiedDate: new Date().toISOString(),
    };
    const res = await fetch(`${BASE_URL}/job/CreateOrSetJob`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log('createJob API response:', data);
    return data;
  }
);

export const approveJob = createAsyncThunk<string, string>(
  'jobs/approveJob',
  async (jobId) => {
    // Fetch job by id, then update status to 'Open'
    const getRes = await fetch(`${BASE_URL}/job/getjobbyid?jobId=${jobId}`);
    const job = await getRes.json();
    const updatedJob = { jobId, flag: 'U', isApproved: true, status: 'Open' };
    const res = await fetch(`${BASE_URL}/job/CreateOrSetJob`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedJob),
    });
    const data = await res.json();
    console.log('approveJob API response:', data);
    return jobId;
  }
);

export const rejectJob = createAsyncThunk<string, string>(
  'jobs/rejectJob',
  async (jobId) => {
    // Fetch job by id, then update status to 'Rejected'
    const getRes = await fetch(`${BASE_URL}/job/getjobbyid?jobId=${jobId}`);
    const job = await getRes.json();
    const updatedJob = { jobId, flag: 'U', isApproved: false, status: 'Rejected' };
    const res = await fetch(`${BASE_URL}/job/CreateOrSetJob`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedJob),
    });
    const data = await res.json();
    console.log('rejectJob API response:', data);
    return jobId;
  }
); 

export const applyToJob = createAsyncThunk<any, { jobId: number; userId: number; status: string; resumeFile: File; coverLetter: string }>(
  'jobs/applyToJob',
  async ({ jobId, userId, status, resumeFile, coverLetter }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('jobId', String(jobId));
      formData.append('userId', String(userId));
      formData.append('status', status);
      formData.append('resumeFile', resumeFile); // file
      formData.append('coverLetter', coverLetter);
      formData.append('flag', 'C');
      formData.append('modifiedBy', String(userId));

      const response = await fetch(`${BASE_URL}/UserApplication/CreateOrSetUserApplication`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to apply to job');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to apply to job');
    }
  }
); 