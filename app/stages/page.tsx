"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, MoveUp, MoveDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { AppDispatch } from "@/redux/store"
import { createStage, updateStageThunk, deleteStageThunk, fetchStages } from "@/redux/stagesThunk"
import { fetchJobs } from "@/redux/jobsThunk"
import type { Stage } from "@/lib/types"

const colorOptions = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Yellow" },
  { value: "#EF4444", label: "Red" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#84CC16", label: "Lime" },
]

export default function StagesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedJob, setSelectedJob] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<Stage | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    order: 1,
    color: "#3B82F6",
  })

  const jobs = useSelector((state: RootState) => state.jobs.jobs)
  const stages = useSelector((state: RootState) => state.stages.stages)
  const loading = useSelector((state: RootState) => state.stages.loading)

  // Fetch stages on component mount
  useEffect(() => {
    dispatch(fetchStages())
    dispatch(fetchJobs()) // Ensure jobs are loaded
  }, [dispatch])

  const filteredStages = stages.filter(stage => 
    selectedJob && selectedJob !== "all" ? stage.jobId === selectedJob : true
  ).sort((a, b) => a.order - b.order)

  const handleCreateStage = async () => {
    if (!selectedJob || selectedJob === "all") {
      toast({
        title: "Error",
        description: "Please select a job first",
        variant: "destructive",
      })
      return
    }

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Stage name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const stageData = {
        name: formData.name,
        order: Number(formData.order), // Use order from form
        jobId: selectedJob,
        isActive: true,
      }

      await dispatch(createStage(stageData)).unwrap()
      setFormData({ name: "", order: 1, color: "#3B82F6" })
      setIsCreateDialogOpen(false)
      
      toast({
        title: "Success",
        description: "Stage created successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create stage",
        variant: "destructive",
      })
    }
  }

  const handleEditStage = (stage: Stage) => {
    setEditingStage(stage)
    setFormData({
      name: stage.name,
      order: stage.order || 1,
      color: stage.color || "#3B82F6",
    })
  }

  const handleUpdateStage = async () => {
    if (!editingStage) return

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Stage name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedStageData = {
        ...editingStage,
        name: formData.name,
        order: Number(formData.order), // Use order from form
      }

      await dispatch(updateStageThunk(updatedStageData)).unwrap()
      setEditingStage(null)
      setFormData({ name: "", order: 1, color: "#3B82F6" })
      
      toast({
        title: "Success",
        description: "Stage updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update stage",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStage = async (stageId: string) => {
    try {
      await dispatch(deleteStageThunk(stageId)).unwrap()
      toast({
        title: "Success",
        description: "Stage deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete stage",
        variant: "destructive",
      })
    }
  }

  const handleMoveStage = (stageId: string, direction: "up" | "down") => {
    const currentIndex = stages.findIndex(s => s.id === stageId)
    if (currentIndex === -1) return

    const newStages = [...stages]
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (targetIndex >= 0 && targetIndex < newStages.length) {
      const currentStage = newStages[currentIndex]
      const targetStage = newStages[targetIndex]

      // Only swap if they belong to the same job
      if (currentStage.jobId === targetStage.jobId) {
        newStages[currentIndex] = { ...targetStage, order: currentStage.order }
        newStages[targetIndex] = { ...currentStage, order: targetStage.order }
        // Note: In a real implementation, you'd dispatch an action to update the order
        // For now, we'll just update the local state
        // dispatch(reorderStages({ jobId: currentStage.jobId, stageIds: newStages.map(s => s.id) }))
      }
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pipeline Stages</h1>
          <p className="text-muted-foreground">
            Manage recruitment pipeline stages for different job positions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Stage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Stage</DialogTitle>
              <DialogDescription>
                Add a new stage to the recruitment pipeline
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="job-select">Job Position</Label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stage-name">Stage Name</Label>
                <Input
                  id="stage-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Technical Interview"
                />
              </div>
              <div>
                <Label htmlFor="stage-order">Order</Label>
                <Input
                  id="stage-order"
                  type="number"
                  min={1}
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                  placeholder="Stage order (e.g., 1, 2, 3)"
                />
              </div>
              <div>
                <Label htmlFor="stage-color">Color</Label>
                <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStage}>Create Stage</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="job-filter">Filter by Job:</Label>
        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All jobs</SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title} - {job.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stages...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredStages.map((stage) => (
            <Card key={stage.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <CardTitle className="text-lg">{stage.name}</CardTitle>
                    <Badge variant={stage.isActive ? "default" : "secondary"}>
                      {stage.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">Order: {stage.order}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveStage(stage.id, "up")}
                      disabled={stage.order === 1}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveStage(stage.id, "down")}
                      disabled={stage.order === stages.filter(s => s.jobId === stage.jobId).length}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStage(stage)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Stage</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{stage.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteStage(stage.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stage.description && (
                    <p className="text-muted-foreground">{stage.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Job: {(() => {
                      const job = jobs.find(j => String(j.id) === String(stage.jobId));
                      return job ? `${job.title} - ${job.company}` : stage.jobId;
                    })()}</span>
                    <span>Created: {new Date(stage.createdDate).toLocaleDateString()}</span>
                    {stage.modifiedDate && (
                      <span>Modified: {new Date(stage.modifiedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredStages.length === 0 && !loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-muted-foreground">No stages found</p>
              <p className="text-sm text-muted-foreground">
                {selectedJob ? "Create stages for the selected job" : "Select a job or create stages"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingStage} onOpenChange={() => setEditingStage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stage</DialogTitle>
            <DialogDescription>
              Update the stage details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-stage-name">Stage Name</Label>
              <Input
                id="edit-stage-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Technical Interview"
              />
            </div>
            <div>
              <Label htmlFor="edit-stage-order">Order</Label>
              <Input
                id="edit-stage-order"
                type="number"
                min={1}
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                placeholder="Stage order (e.g., 1, 2, 3)"
              />
            </div>
            <div>
              <Label htmlFor="edit-stage-color">Color</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStage(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStage}>Update Stage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 