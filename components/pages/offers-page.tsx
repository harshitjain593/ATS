"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Briefcase, DollarSign, Calendar, ChevronDown, Download, Eye } from "lucide-react"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { RootState, AppDispatch } from "@/redux/store"
import { useSelector, useDispatch } from "react-redux"
import { fetchOffers, createOffer, updateOffer, deleteOffer } from "@/redux/offersThunk"
import { fetchJobs } from "@/redux/jobsThunk"
import { getCandidatesFromApi } from "@/redux/candidatesThunk"
import { generateOfferLetterPDF } from "@/utils/pdf-generator"
import { Offer } from "@/lib/types"

export function OffersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateOfferDialogOpen, setIsCreateOfferDialogOpen] = useState(false)
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    candidateId: "",
    jobId: "",
    baseSalary: 0,
    bonus: 0,
    benefits: [],
    equity: "",
    startDate: "",
    reportingTo: "",
    workSchedule: "",
    probationPeriod: "",
    noticePeriod: "",
    terminationClause: "",
    confidentialityClause: "",
    nonCompeteClause: "",
    intellectualPropertyClause: "",
    offerExpiryDate: "",
    acceptanceDeadline: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
    termsAndConditions: [],
    status: "Pending",
  })

  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const { offers, loading, error } = useSelector((state: RootState) => state.offers)
  const { jobs } = useSelector((state: RootState) => state.jobs)
  const { candidates } = useSelector((state: RootState) => state.candidates)
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    } else {
      dispatch(fetchOffers() as any)
      dispatch(fetchJobs() as any)
      dispatch(getCandidatesFromApi() as any)
    }
  }, [currentUser, isLoadingUser, router, dispatch])

  const filteredOffers = useMemo(() => {
    let currentOffers = offers

    if (filterStatus !== "all") {
      currentOffers = currentOffers.filter((offer) => offer.status === filterStatus)
    }

    if (searchTerm) {
      currentOffers = currentOffers.filter((offer) => {
        const candidate = candidates.find((c) => c.id === offer.candidateId)
        const job = jobs.find((j) => j.id === offer.jobId)

        return (
          candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job?.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    return currentOffers
  }, [searchTerm, filterStatus, offers, candidates, jobs])

  const handleCreateOffer = async () => {
    if (!newOffer.candidateId || !newOffer.jobId || !newOffer.baseSalary || !newOffer.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required offer details.",
        variant: "destructive",
        id: "missing-offer-info"
      })
      return
    }

    try {
      await dispatch(createOffer(newOffer) as any)
      setIsCreateOfferDialogOpen(false)
      setNewOffer({
        candidateId: "",
        jobId: "",
        baseSalary: 0,
        bonus: 0,
        benefits: [],
        equity: "",
        startDate: "",
        reportingTo: "",
        workSchedule: "",
        probationPeriod: "",
        noticePeriod: "",
        terminationClause: "",
        confidentialityClause: "",
        nonCompeteClause: "",
        intellectualPropertyClause: "",
        offerExpiryDate: "",
        acceptanceDeadline: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
        notes: "",
        termsAndConditions: [],
        status: "Pending",
      })
      toast({
        title: "Offer Created",
        description: "Offer letter has been created successfully.",
        id: "offer-created"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create offer.",
        variant: "destructive",
        id: "offer-creation-error"
      })
    }
  }

  const handleDownloadPDF = (offer: Offer) => {
    generateOfferLetterPDF(offer)
  }

  const getStatusColor = (status: Offer["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Accepted":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Withdrawn":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (isLoadingUser || !currentUser || currentUser.role === "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading offers...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offers</h1>
          <p className="text-muted-foreground">Manage and track all job offers.</p>
        </div>
        {(currentUser.role === "admin" || currentUser.role === "recruiter") && (
          <Button className="gap-2" onClick={() => setIsCreateOfferDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create New Offer
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search offers by candidate or job..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Status: {filterStatus === "all" ? "All" : filterStatus}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Pending")}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Accepted")}>Accepted</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Rejected")}>Rejected</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Withdrawn")}>Withdrawn</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Offer Listings */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading offers...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No offers found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => {
            const candidate = candidates.find((c) => c.id === offer.candidateId)
            const job = jobs.find((j) => j.id === offer.jobId)

            return (
              <Card key={offer.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleDownloadPDF(offer)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{candidate?.name || "N/A"}</CardTitle>
                    <Badge className={getStatusColor(offer.status)} variant="outline">
                      {offer.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> {job?.title || "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Salary: ${offer.baseSalary?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Start Date: {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  {offer.notes && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Notes:</p>
                      <p className="line-clamp-2">{offer.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadPDF(offer)
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create New Offer Dialog */}
      <Dialog open={isCreateOfferDialogOpen} onOpenChange={setIsCreateOfferDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Offer Letter</DialogTitle>
            <CardDescription>Fill in all the details for the comprehensive offer letter.</CardDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidate">Candidate *</Label>
                  <Select
                    value={newOffer.candidateId}
                    onValueChange={(value) => setNewOffer({ ...newOffer, candidateId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map((candidate) => (
                        <SelectItem key={candidate.id} value={candidate.id}>
                          {candidate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="job">Job Position *</Label>
                  <Select value={newOffer.jobId} onValueChange={(value) => setNewOffer({ ...newOffer, jobId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Position Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Position Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    value={newOffer.department || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, department: e.target.value })}
                    placeholder="e.g., Engineering"
                  />
                </div>
                <div>
                  <Label htmlFor="reportingTo">Reporting To</Label>
                  <Input
                    value={newOffer.reportingTo || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, reportingTo: e.target.value })}
                    placeholder="e.g., Engineering Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="workSchedule">Work Schedule</Label>
                  <Input
                    value={newOffer.workSchedule || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, workSchedule: e.target.value })}
                    placeholder="e.g., Monday-Friday, 9 AM-6 PM"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    type="date"
                    value={newOffer.startDate || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Compensation & Benefits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="baseSalary">Base Salary *</Label>
                  <Input
                    type="number"
                    value={newOffer.baseSalary || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, baseSalary: Number(e.target.value) })}
                    placeholder="e.g., 75000"
                  />
                </div>
                <div>
                  <Label htmlFor="bonus">Bonus</Label>
                  <Input
                    type="number"
                    value={newOffer.bonus || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, bonus: Number(e.target.value) })}
                    placeholder="e.g., 10000"
                  />
                </div>
                <div>
                  <Label htmlFor="equity">Equity</Label>
                  <Input
                    value={newOffer.equity || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, equity: e.target.value })}
                    placeholder="e.g., 1000 RSUs"
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                  <Input
                    value={newOffer.benefits?.join(', ') || ''}
                    onChange={(e) => setNewOffer({ 
                      ...newOffer, 
                      benefits: e.target.value.split(',').map(b => b.trim()).filter(b => b)
                    })}
                    placeholder="Health insurance, 401k, PTO"
                  />
                </div>
              </div>
            </div>

            {/* Employment Terms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Employment Terms</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="probationPeriod">Probation Period</Label>
                  <Input
                    value={newOffer.probationPeriod || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, probationPeriod: e.target.value })}
                    placeholder="e.g., 90 days"
                  />
                </div>
                <div>
                  <Label htmlFor="noticePeriod">Notice Period</Label>
                  <Input
                    value={newOffer.noticePeriod || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, noticePeriod: e.target.value })}
                    placeholder="e.g., 2 weeks"
                  />
                </div>
                <div>
                  <Label htmlFor="offerExpiryDate">Offer Expiry Date</Label>
                  <Input
                    type="date"
                    value={newOffer.offerExpiryDate || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, offerExpiryDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="acceptanceDeadline">Acceptance Deadline</Label>
                  <Input
                    type="date"
                    value={newOffer.acceptanceDeadline || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, acceptanceDeadline: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Legal Clauses */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal Clauses</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="terminationClause">Termination Clause</Label>
                  <Textarea
                    value={newOffer.terminationClause || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, terminationClause: e.target.value })}
                    placeholder="Enter termination clause..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="confidentialityClause">Confidentiality Clause</Label>
                  <Textarea
                    value={newOffer.confidentialityClause || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, confidentialityClause: e.target.value })}
                    placeholder="Enter confidentiality clause..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="nonCompeteClause">Non-Compete Clause</Label>
                  <Textarea
                    value={newOffer.nonCompeteClause || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, nonCompeteClause: e.target.value })}
                    placeholder="Enter non-compete clause..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="intellectualPropertyClause">Intellectual Property Clause</Label>
                  <Textarea
                    value={newOffer.intellectualPropertyClause || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, intellectualPropertyClause: e.target.value })}
                    placeholder="Enter intellectual property clause..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    value={newOffer.contactPerson || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, contactPerson: e.target.value })}
                    placeholder="e.g., HR Manager"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    type="email"
                    value={newOffer.contactEmail || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, contactEmail: e.target.value })}
                    placeholder="hr@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    value={newOffer.contactPhone || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, contactPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newOffer.status}
                    onValueChange={(value) => setNewOffer({ ...newOffer, status: value as Offer["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  value={newOffer.notes || ''}
                  onChange={(e) => setNewOffer({ ...newOffer, notes: e.target.value })}
                  placeholder="Additional notes or comments..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="termsAndConditions">Terms & Conditions (one per line)</Label>
                <Textarea
                  value={newOffer.termsAndConditions?.join('\n') || ''}
                  onChange={(e) => setNewOffer({ 
                    ...newOffer, 
                    termsAndConditions: e.target.value.split('\n').filter(t => t.trim())
                  })}
                  placeholder="Enter terms and conditions, one per line..."
                  rows={4}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOfferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOffer} disabled={loading}>
              {loading ? "Creating..." : "Create Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
