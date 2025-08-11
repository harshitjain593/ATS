import { createAsyncThunk } from '@reduxjs/toolkit'
import { Offer } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Fetch all offers
export const fetchOffers = createAsyncThunk<Offer[]>(
  'offers/fetchOffers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/offer/getAllOffers`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data.data || []
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch offers')
    }
  }
)

// Create new offer
export const createOffer = createAsyncThunk<Offer, Partial<Offer>>(
  'offers/createOffer',
  async (offerData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/offer/CreateOrSetOffer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        //   offerId: 0,
        userApplicationId: offerData.candidateId,
          jobId: offerData.jobId,
          baseSalary: offerData.baseSalary,
          bonus: offerData.bonus || 0,
          benefits: offerData.benefits?.join(', ') || '',
          equity: offerData.equity || '',
          startDate: offerData.startDate,
          reportingTo: offerData.reportingTo || '',
          workSchedule: offerData.workSchedule || '',
          probationPeriod: offerData.probationPeriod || '',
          noticePeriod: offerData.noticePeriod || '',
          terminationClause: offerData.terminationClause || '',
          confidentialityClause: offerData.confidentialityClause || '',
          nonCompeteClause: offerData.nonCompeteClause || '',
          intellectualPropertyClause: offerData.intellectualPropertyClause || '',
          offerExpiryDate: offerData.offerExpiryDate,
          acceptanceDeadline: offerData.acceptanceDeadline,
          contactPerson: offerData.contactPerson || '',
          contactEmail: offerData.contactEmail || '',
          contactPhone: offerData.contactPhone || '',
          notes: offerData.notes || '',
          termsAndConditions: offerData.termsAndConditions?.join('; ') || '',
          status: offerData.status || 'Pending',
          flag: 'C',
          createdBy: '1', // TODO: Get from current user
        //   createdDate: new Date().toISOString(),
          modifiedBy: '1', // TODO: Get from current user
        //   modifiedDate: new Date().toISOString(),
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.data || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create offer')
    }
  }
)

// Update offer
export const updateOffer = createAsyncThunk<Offer, { id: string; data: Partial<Offer> }>(
  'offers/updateOffer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/offer/CreateOrSetOffer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerId: Number(id),
          candidateId: data.candidateId,
          jobId: data.jobId,
          baseSalary: data.baseSalary,
          bonus: data.bonus || 0,
          benefits: data.benefits?.join(', ') || '',
          equity: data.equity || '',
          startDate: data.startDate,
          reportingTo: data.reportingTo || '',
          workSchedule: data.workSchedule || '',
          probationPeriod: data.probationPeriod || '',
          noticePeriod: data.noticePeriod || '',
          terminationClause: data.terminationClause || '',
          confidentialityClause: data.confidentialityClause || '',
          nonCompeteClause: data.nonCompeteClause || '',
          intellectualPropertyClause: data.intellectualPropertyClause || '',
          offerExpiryDate: data.offerExpiryDate,
          acceptanceDeadline: data.acceptanceDeadline,
          contactPerson: data.contactPerson || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          notes: data.notes || '',
          termsAndConditions: data.termsAndConditions?.join('; ') || '',
          status: data.status,
          flag: 'U',
          modifiedBy: '1', // TODO: Get from current user
          modifiedDate: new Date().toISOString(),
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const responseData = await response.json()
      return responseData.data || responseData
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update offer')
    }
  }
)

// Delete offer
export const deleteOffer = createAsyncThunk<string, string>(
  'offers/deleteOffer',
  async (offerId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/offer/CreateOrSetOffer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerId: Number(offerId),
          flag: 'D',
          modifiedBy: '1', // TODO: Get from current user
          modifiedDate: new Date().toISOString(),
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return offerId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete offer')
    }
  }
)

// Fetch offer by ID
export const fetchOfferById = createAsyncThunk<Offer, string>(
  'offers/fetchOfferById',
  async (offerId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/offer/getOfferById?offerId=${offerId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data.data || data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch offer')
    }
  }
) 