import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Offer } from '@/lib/types'
import { fetchOffers, createOffer, updateOffer, deleteOffer, fetchOfferById } from './offersThunk'

interface OffersState {
  offers: Offer[]
  loading: boolean
  error: string | null
  selectedOffer: Offer | null
}

const initialState: OffersState = {
  offers: [],
  loading: false,
  error: null,
  selectedOffer: null,
}

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload
    },
    addOfferLocal: (state, action: PayloadAction<Offer>) => {
      state.offers.push(action.payload)
    },
    updateOfferLocal: (state, action: PayloadAction<Offer>) => {
      const index = state.offers.findIndex(offer => offer.id === action.payload.id)
      if (index !== -1) {
        state.offers[index] = action.payload
      }
    },
    deleteOfferLocal: (state, action: PayloadAction<string>) => {
      state.offers = state.offers.filter(offer => offer.id !== action.payload)
    },
    setSelectedOffer: (state, action: PayloadAction<Offer | null>) => {
      state.selectedOffer = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    // fetchOffers
    builder.addCase(fetchOffers.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchOffers.fulfilled, (state, action) => {
      state.loading = false
      state.offers = action.payload
    })
    builder.addCase(fetchOffers.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // createOffer
    builder.addCase(createOffer.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createOffer.fulfilled, (state, action) => {
      state.loading = false
      state.offers.push(action.payload)
    })
    builder.addCase(createOffer.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // updateOffer
    builder.addCase(updateOffer.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateOffer.fulfilled, (state, action) => {
      state.loading = false
      const index = state.offers.findIndex(offer => offer.id === action.payload.id)
      if (index !== -1) {
        state.offers[index] = action.payload
      }
    })
    builder.addCase(updateOffer.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // deleteOffer
    builder.addCase(deleteOffer.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteOffer.fulfilled, (state, action) => {
      state.loading = false
      state.offers = state.offers.filter(offer => offer.id !== action.payload)
    })
    builder.addCase(deleteOffer.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // fetchOfferById
    builder.addCase(fetchOfferById.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchOfferById.fulfilled, (state, action) => {
      state.loading = false
      state.selectedOffer = action.payload
    })
    builder.addCase(fetchOfferById.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const {
  setOffers,
  addOfferLocal,
  updateOfferLocal,
  deleteOfferLocal,
  setSelectedOffer,
  setLoading,
  setError,
} = offersSlice.actions

export default offersSlice.reducer 