"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaExclamation } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdShare,
  MdWorkspacePremium,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  DollarSign,
  Layers,
  Loader2,
  User,
  Award,
  Tag,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUser } from "@/components/Providers/LoggedInUser/LoggedInUserProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  goal: z.string().min(1, "Goal is required"),
  description: z.string().min(1, "Description is required"),
  preferredDaysPerWeek: z.number().min(1, "Must be at least 1 day"),
  budgetPerWeek: z.number().min(0, "Budget cannot be negative"),
  availableTimeSlots: z
    .array(z.string())
    .min(1, "Select at least one time slot"),
  status: z.enum(["Active", "Inactive", "Disabled", "Pending"]),
});

type TrainingRequestFormData = z.infer<typeof formSchema>;
const timeSlotOptions = ["Morning", "Afternoon", "Evening", "Night"];

export default function CreateTrainingRequestForm() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const userContext = useUser();
  const user = (userContext as any)?.user;
  const loading = (userContext as any)?.loading;

  const [open, setOpen] = useState(false);
  const [toEditRequest, setToEditRequest] = useState<any>(null);
  const [status, setStatus] = useState<string>("Active");

  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TrainingRequestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: "",
      description: "",
      preferredDaysPerWeek: 0,
      budgetPerWeek: 0,
      availableTimeSlots: [],
      status: "Active",
    },
  });
  const queryClient = useQueryClient();

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const toggleSlot = (slot: string) => {
    let updated;
    if (selectedSlots.includes(slot)) {
      updated = selectedSlots.filter((s) => s !== slot);
    } else {
      updated = [...selectedSlots, slot];
    }
    setSelectedSlots(updated);
    setValue("availableTimeSlots", updated);
  };

  // Submit training request data
  const onSubmit = async (data: TrainingRequestFormData) => {
    try {
      const url = toEditRequest
        ? `${api}/update-training-request/${toEditRequest._id}`
        : `${api}/create-training-request`;

      const method = toEditRequest ? "PUT" : "POST";
      const body = JSON.stringify(data);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const resBody = await res.json();
      if (!res.ok)
        throw new Error(
          resBody.message || "Failed to process training request"
        );

      toast.success(resBody.message);
      reset();
      setOpen(false);
      setToEditRequest(null);
      queryClient.invalidateQueries({ queryKey: ["trainingRequests"] });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process training request");
    }
  };

  // Get all my training requests
  const getMyTrainingRequests = async () => {
    try {
      const res = await fetch(`${api}/get-my-training-requests`);
      const resBody = await res.json();
      return resBody;
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch training requests");
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryFn: getMyTrainingRequests,
    queryKey: ["trainingRequests"],
  });

  const { trainingRequests } = data || {};

  // Toggle request selection
  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  // Delete selected requests
  const deleteRequests = async () => {
    try {
      const res = await fetch(`${api}/delete-training-requests`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestIds: selectedRequests }),
      });
      const resBody = await res.json();
      if (!res.ok)
        throw new Error(
          resBody.message || "Failed to delete training requests"
        );
      toast.success(
        resBody.message || "Training requests deleted successfully"
      );
      setSelectedRequests([]);
      queryClient.invalidateQueries({ queryKey: ["trainingRequests"] });
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete training requests"
      );
    }
  };

  // Edit Training Request
  const editRequest = (request: any) => {
    setToEditRequest(request);
    reset({
      goal: request.goal,
      description: request.description,
      preferredDaysPerWeek: request.preferredDaysPerWeek,
      budgetPerWeek: request.budgetPerWeek,
      availableTimeSlots: request.availableTimeSlots || [],
      status: request.status || "Active",
    });
    setStatus(request?.status || "Active");
    setSelectedSlots(request.availableTimeSlots || []);
    setOpen(true);
  };

  const getBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;

      case "Inactive":
        return <Badge className="bg-red-400 text-white">Inactive</Badge>;

      case "Pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;

      case "Disabled":
        return <Badge className="bg-red-500 text-white">Disabled</Badge>;

      default:
        return <Badge className="bg-slate-500 text-white">Unknown</Badge>;
    }
  };

  // Clear states before opening new form
  const clearStates = () => {
    reset({
      goal: "",
      description: "",
      preferredDaysPerWeek: 0,
      budgetPerWeek: 0,
      availableTimeSlots: [],
      status: "Active",
    });
    setStatus("Active");
    setSelectedSlots([]);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-xl font-semibold">
            {user.role === "Member"
              ? "My Training Requests"
              : "Training Requests"}
          </h1>
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setToEditRequest(null);
                reset();
                setSelectedSlots([]);
              }
              setOpen(isOpen);
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={clearStates}
                className="gap-2 py-5 rounded-sm cursor-pointer"
              >
                <MdAdd className="h-4 w-4" />
                <span>Create Training Request</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] dark:bg-gray-900 p-0 rounded-lg">
              <div className="relative">
                <DialogHeader className="border-b p-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-orange-500" />
                    <div>
                      <DialogTitle className="text-2xl">
                        Training Request Form
                      </DialogTitle>
                      <DialogDescription>
                        Fill in the details to create or edit a training request
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-180px)] p-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Goal */}
                    <div className="space-y-2">
                      <Label htmlFor="goal" className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-orange-500" />
                        Goal
                      </Label>
                      <Input
                        id="goal"
                        {...register("goal")}
                        placeholder="e.g., I have to lost 10 kg in 5 months"
                        className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                      />
                      {errors.goal && (
                        <p className="text-sm text-red-500">
                          {errors.goal.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="flex items-center gap-2"
                      >
                        <BookOpen className="h-4 w-4 text-orange-500" />
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Detailed description of your training goals..."
                        rows={4}
                        className="focus-visible:ring-1 focus-visible:ring-orange-500 min-h-[120px] rounded-sm"
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    {/* Preferred days per week and Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="preferredDaysPerWeek"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4 text-orange-500" />
                          Preferred days per week
                        </Label>
                        <Input
                          id="preferredDaysPerWeek"
                          type="number"
                          {...register("preferredDaysPerWeek", {
                            valueAsNumber: true,
                          })}
                          placeholder="e.g., 3"
                          className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                        />
                        {errors.preferredDaysPerWeek && (
                          <p className="text-sm text-red-500">
                            {errors.preferredDaysPerWeek.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="budgetPerWeek"
                          className="flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4 text-orange-500" />
                          Budget per week ($)
                        </Label>
                        <Input
                          id="budgetPerWeek"
                          type="number"
                          step="0.01"
                          {...register("budgetPerWeek", {
                            valueAsNumber: true,
                          })}
                          placeholder="e.g., 199.99"
                          className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                        />
                        {errors.budgetPerWeek && (
                          <p className="text-sm text-red-500">
                            {errors.budgetPerWeek.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Available Time Slots */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-orange-500" />
                        Available Time Slots
                      </Label>

                      <div className="grid grid-cols-2 gap-2">
                        {timeSlotOptions.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => toggleSlot(slot)}
                            className={`py-2 px-4 rounded border ${
                              selectedSlots.includes(slot)
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      {errors.availableTimeSlots && (
                        <p className="text-sm text-red-500">
                          {errors.availableTimeSlots.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="status"
                        className="flex items-center gap-2"
                      >
                        <Award className="h-4 w-4 text-orange-500" />
                        Status
                      </Label>
                      <Select
                        onValueChange={(value: any) =>
                          setValue("status", value)
                        }
                        {...register("status")}
                        defaultValue={status}
                      >
                        <SelectTrigger className="w-full focus:ring-1 focus:ring-orange-500 py-6 rounded-sm cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active" className="cursor-pointer">
                            Active
                          </SelectItem>
                          <SelectItem
                            value="Inactive"
                            className="cursor-pointer"
                          >
                            Inactive
                          </SelectItem>
                          <SelectItem
                            value="Disabled"
                            className="cursor-pointer"
                          >
                            Disabled
                          </SelectItem>
                          <SelectItem
                            value="Pending"
                            className="cursor-pointer"
                          >
                            Pending
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <p className="text-sm text-red-500">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </form>
                </ScrollArea>

                <div className="border-t p-4 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="py-5 rounded-sm cursor-pointer mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="py-5 rounded-sm cursor-pointer bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {toEditRequest ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {toEditRequest
                          ? "Update Training Request"
                          : "Create Training Request"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Training Requests List */}
      <Card className="p-6 rounded-lg">
        <CardHeader className="p-0 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Training Requests</CardTitle>
              <CardDescription>
                {trainingRequests?.length || 0} request
                {trainingRequests?.length !== 1 ? "s" : ""} available
              </CardDescription>
            </div>
            {selectedRequests.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="cursor-pointer gap-2 py-5 rounded-sm"
                  >
                    <MdDelete className="h-4 w-4" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-white dark:bg-zinc-900 border border-red-500 shadow-xl rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 dark:text-red-400 text-lg font-semibold flex items-center">
                      <FaExclamation className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
                      Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-700 dark:text-zinc-300 mt-2">
                      {selectedRequests.length} are selected. Are you sure you
                      want to delete those training requests? This action{" "}
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        cannot be undone and this action will remove data from
                        our server completely.
                      </span>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="flex justify-end gap-3 mt-4">
                    <AlertDialogCancel className="cursor-pointer bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded px-4 py-1.5">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded px-4 py-1.5 shadow"
                      onClick={deleteRequests}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : trainingRequests?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No training requests found. Create your first training request to
              get started.
            </div>
          ) : (
            <div className="space-y-4">
              {trainingRequests?.map((request: any) => (
                <Card key={request._id} className="relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                  <div className="p-4 flex items-start gap-4">
                    <Checkbox
                      checked={selectedRequests.includes(request._id)}
                      onCheckedChange={() =>
                        toggleRequestSelection(request._id)
                      }
                      className="mt-1"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">{request.goal}</h3>
                        {getBadge(request?.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.description}
                      </p>

                      <div className="w-full mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{request.preferredDaysPerWeek} days/week</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>${request.budgetPerWeek}/week</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-gray-500" />
                          <span>
                            {request.availableTimeSlots?.length || 0} time slots
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-500" />
                          <span>
                            {request.availableTimeSlots?.join(", ") ||
                              "No slots"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            onClick={() => {
                              editRequest(request);
                            }}
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer hover:bg-gray-100 rounded-sm cursor-pointer"
                          >
                            <MdEdit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Training Request</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer hover:bg-gray-100 rounded-sm cursor-pointer"
                          >
                            <MdShare className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share Training Request</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer hover:bg-gray-100 rounded-sm cursor-pointer"
                          >
                            <MdWorkspacePremium className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Promote Training Request</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
