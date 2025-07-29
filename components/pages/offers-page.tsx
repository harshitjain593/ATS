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
import { Search, Plus, Briefcase, DollarSign, Calendar, ChevronDown } from "lucide-react"
import { mockOffers, mockCandidates, mockJobs, type Offer } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

export function OffersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // 'all', 'Pending', 'Accepted', 'Rejected', 'Withdrawn'
  const [offers, setOffers] = useState<Offer[]>(mockOffers) // Use state to allow adding new offers
  const [isCreateOfferDialogOpen, setIsCreateOfferDialogOpen] = useState(false)
  const [newOffer, setNewOffer] = useState<Omit<Offer, "id">>({
    candidateId: "",
    jobId: "",
    salary: 0,
    startDate: "",
    status: "Pending",
  })

  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  const filteredOffers = useMemo(() => {
    let currentOffers = offers

    if (filterStatus !== "all") {
      currentOffers = currentOffers.filter((offer) => offer.status === filterStatus)
    }

    if (searchTerm) {
      currentOffers = currentOffers.filter((offer) => {
        const candidate = mockCandidates.find((c) => c.id === offer.candidateId)
        const job = mockJobs.find((j) => j.id === offer.jobId)

        return (
          candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job?.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    return currentOffers
  }, [searchTerm, filterStatus, offers])

  const handleCreateOffer = () => {
    if (!newOffer.candidateId || !newOffer.jobId || !newOffer.salary || !newOffer.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required offer details.",
        variant: "destructive",
      })
      return
    }

    const offerId = `offer-${mockOffers.length + 1}`
    const createdOffer: Offer = {
      ...newOffer,
      id: offerId,
    }
    mockOffers.push(createdOffer) // Add to mock data
    setOffers([...mockOffers]) // Update state to re-render
    setIsCreateOfferDialogOpen(false)
    setNewOffer({
      candidateId: "",
      jobId: "",
      salary: 0,
      startDate: "",
      status: "Pending",
    })
    toast({
      title: "Offer Created",
      description: `Offer for ${mockCandidates.find((c) => c.id === createdOffer.candidateId)?.name} has been extended.`,
    })
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
      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No offers found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => {
            const candidate = mockCandidates.find((c) => c.id === offer.candidateId)
            const job = mockJobs.find((j) => j.id === offer.jobId)

            return (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{candidate?.name || "N/A"}</CardTitle>
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
                    <span>Salary: ${offer.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Start Date: {offer.startDate}</span>
                  </div>
                  {offer.notes && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Notes:</p>
                      <p className="line-clamp-2">{offer.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create New Offer Dialog */}
      <Dialog open={isCreateOfferDialogOpen} onOpenChange={setIsCreateOfferDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
            <CardDescription>Fill in the details for the new job offer.</CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="candidate" className="text-right">
                Candidate
              </Label>
              <Select
                value={newOffer.candidateId}
                onValueChange={(value) => setNewOffer({ ...newOffer, candidateId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {mockCandidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="job" className="text-right">
                Job
              </Label>
              <Select value={newOffer.jobId} onValueChange={(value) => setNewOffer({ ...newOffer, jobId: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {mockJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Salary
              </Label>
              <Input
                id="salary"
                type="number"
                value={newOffer.salary}
                onChange={(e) => setNewOffer({ ...newOffer, salary: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newOffer.startDate}
                onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newOffer.status}
                onValueChange={(value) => setNewOffer({ ...newOffer, status: value as Offer["status"] })}
              >
                <SelectTrigger className="col-span-3">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOfferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOffer}>Create Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
