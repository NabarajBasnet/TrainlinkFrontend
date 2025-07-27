"use client";

import { HiMiniMapPin } from "react-icons/hi2";
import { Activity, Globe, Eye, CalendarDays, ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
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
import { Controller } from "react-hook-form";

const formSchema = z.object({
  // Basic Information
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),

  // Pricing & Duration
  durationInWeeks: z.number().min(1, "Must be at least 1 week"),
  price: z.number().min(0, "Price cannot be negative"),

  // Program Details
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  maxSlot: z.number().min(1, "Must have at least 1 slot"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Active", "Inactive", "Draft", "Completed"]),

  // Location & Availability
  location: z.string().optional(),
  isOnline: z.boolean().default(true),
  isInPerson: z.boolean().default(false),

  // Tags
  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
});

type ProgramFormData = z.infer<typeof formSchema>;

export default function CreateProgramForm() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const userContext = useUser();
  const user = (userContext as any)?.user;
  const loading = (userContext as any)?.loading;

  const [open, setOpen] = useState(false);
  const [toEditProgram, setToEditProgram] = useState<any>(null);
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState<string>("Inactive");

  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm<ProgramFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      durationInWeeks: 0,
      price: 0,
      level: "Beginner",
      maxSlot: 0,
      category: "",
      status: "Active",
      isOnline: true,
      isInPerson: false,
      tags: [],
    },
  });

  const queryClient = useQueryClient();

  // Submit program data
  const onSubmit = async (data: ProgramFormData) => {
    try {
      const url = toEditProgram
        ? `${api}/update-program/${toEditProgram._id}`
        : `${api}/create-program`;

      const method = toEditProgram ? "PUT" : "POST";
      const body = JSON.stringify(data);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const resBody = await res.json();
      if (!res.ok)
        throw new Error(resBody.message || "Failed to process program");

      toast.success(resBody.message);
      reset();
      setOpen(false);
      setToEditProgram(null);
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process program");
    }
  };

  // Get all my programs
  const getMyPrograms = async () => {
    try {
      const res = await fetch(`${api}/get-my-programs`);
      const resBody = await res.json();
      return resBody;
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch programs");
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryFn: getMyPrograms,
    queryKey: ["programs"],
  });

  const { programs } = data || {};

  // Toggle program selection
  const toggleProgramSelection = (programId: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  // Delete selected programs
  const deletePrograms = async () => {
    try {
      // Delete programs one by one since the backend expects individual IDs
      const deletePromises = selectedPrograms.map(async (programId) => {
        const res = await fetch(`${api}/delete-program/${programId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const resBody = await res.json();
          throw new Error(resBody.message || "Failed to delete program");
        }
        return res.json();
      });

      await Promise.all(deletePromises);
      toast.success("Programs deleted successfully");
      setSelectedPrograms([]);
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete programs"
      );
    }
  };

  // Edit Program
  const editProgram = (program: any) => {
    setToEditProgram(program);

    reset({
      title: program.title,
      description: program.description,
      durationInWeeks: program.durationInWeeks,
      price: program.price,
      level: program.level,
      maxSlot: program.maxSlot,
      category: program.category,
      location: program.location,
      tags: program.tags,
      isOnline: program.isOnline,
      isInPerson: program.isInPerson,
      status: program.status || "Active",
    });

    setLevel(program?.level);
    setOpen(true);
  };


  const getBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;

      case "Inactive":
        return <Badge className="bg-red-400 text-white">Inactive</Badge>;

      case "Draft":
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
      title: "",
      description: "",
      durationInWeeks: 0,
      price: 0,
      maxSlot: 0,
      category: "",
      status: "Active",
      location: "0",
      isOnline: false,
      isInPerson: false,
      tags: []
    });
    setLevel("Beginner");
    setStatus("Active");
  };

  return (
    <div className="w-full space-y-4">
      <Card className="p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-xl font-semibold">
            {user.role === "Trainer"
              ? "My Training Programs"
              : "My Current Plan"}
          </h1>
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setToEditProgram(null);
                reset();
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
                <span>Create Program</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] dark:bg-gray-900 p-0 rounded-lg">
              <div className="relative">
                <DialogHeader className="border-b p-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-orange-500" />
                    <div>
                      <DialogTitle className="text-2xl">
                        Program Details
                      </DialogTitle>
                      <DialogDescription>
                        Fill in the details to create or edit a training program
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-180px)] p-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-orange-500 border-b pb-2">Basic Information</h3>

                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-orange-500" />
                          Program Title
                        </Label>
                        <Input
                          id="title"
                          {...register("title")}
                          placeholder="e.g., 12-Week Fat Loss Program"
                          className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-orange-500" />
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          {...register("description")}
                          placeholder="Detailed description of the program..."
                          rows={4}
                          className="focus-visible:ring-1 focus-visible:ring-orange-500 min-h-[120px] rounded-sm"
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Pricing & Duration Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-orange-500 border-b pb-2">Pricing & Duration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Duration */}
                        <div className="space-y-2">
                          <Label htmlFor="durationInWeeks" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            Duration (weeks)
                          </Label>
                          <Input
                            id="durationInWeeks"
                            type="number"
                            {...register("durationInWeeks", { valueAsNumber: true })}
                            placeholder="e.g., 12"
                            className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                          />
                          {errors.durationInWeeks && (
                            <p className="text-sm text-red-500">{errors.durationInWeeks.message}</p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                          <Label htmlFor="price" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-orange-500" />
                            Price ($)
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register("price", { valueAsNumber: true })}
                            placeholder="e.g., 199.99"
                            className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                          />
                          {errors.price && (
                            <p className="text-sm text-red-500">{errors.price.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Program Details Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-orange-500 border-b pb-2">Program Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Level */}
                        <div className="space-y-2">
                          <Label htmlFor="level" className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-orange-500" />
                            Difficulty Level
                          </Label>
                          <Select
                            onValueChange={(value) => setValue("level", value)}
                            {...register("level")}
                            defaultValue={level}
                          >
                            <SelectTrigger className="w-full focus:ring-1 focus:ring-orange-500 py-6 rounded-sm cursor-pointer">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner" className="cursor-pointer">
                                Beginner
                              </SelectItem>
                              <SelectItem value="Intermediate" className="cursor-pointer">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="Advanced" className="cursor-pointer">
                                Advanced
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.level && (
                            <p className="text-sm text-red-500">{errors.level.message}</p>
                          )}
                        </div>

                        {/* Max Participants */}
                        <div className="space-y-2">
                          <Label htmlFor="maxSlot" className="flex items-center gap-2">
                            <User className="h-4 w-4 text-orange-500" />
                            Max Participants
                          </Label>
                          <Input
                            id="maxSlot"
                            type="number"
                            {...register("maxSlot", { valueAsNumber: true })}
                            placeholder="e.g., 20"
                            className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                          />
                          {errors.maxSlot && (
                            <p className="text-sm text-red-500">{errors.maxSlot.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label htmlFor="category" className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-orange-500" />
                          Category
                        </Label>
                        <Input
                          id="category"
                          {...register("category")}
                          placeholder="e.g., Fat Loss, Muscle Building"
                          className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                        />
                        {errors.category && (
                          <p className="text-sm text-red-500">{errors.category.message}</p>
                        )}
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label htmlFor="status" className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-orange-500" />
                          Status
                        </Label>

                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full focus:ring-1 focus:ring-orange-500 py-6 rounded-sm cursor-pointer">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active" className="cursor-pointer">
                                  Active
                                </SelectItem>
                                <SelectItem value="Inactive" className="cursor-pointer">
                                  Inactive
                                </SelectItem>
                                <SelectItem value="Draft" className="cursor-pointer">
                                  Draft
                                </SelectItem>
                                <SelectItem value="Completed" className="cursor-pointer">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />

                        {errors.status && (
                          <p className="text-sm text-red-500">{errors.status.message}</p>
                        )}
                      </div>

                    </div>

                    {/* Location & Availability Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-orange-500 border-b pb-2">Location & Availability</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center gap-2">
                            <HiMiniMapPin className="h-4 w-4 text-orange-500" />
                            Location (if in-person)
                          </Label>
                          <Input
                            id="location"
                            {...register("location")}
                            placeholder="e.g., New York, NY or Online"
                            className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                          />
                          {errors.location && (
                            <p className="text-sm text-red-500">{errors.location.message}</p>
                          )}
                        </div>

                        {/* Delivery Type */}
                        <div className="space-y-4">
                          <Label className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-orange-500" />
                            Delivery Type
                          </Label>
                          <div className="flex items-center space-x-4">
                            <Controller
                              name="isOnline"
                              control={control}
                              render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="isOnline"
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                                  />
                                  <Label htmlFor="isOnline">Online</Label>
                                </div>
                              )}
                            />

                            <Controller
                              name="isInPerson"
                              control={control}
                              render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="isInPerson"
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                                  />
                                  <Label htmlFor="isInPerson">In-Person</Label>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-orange-500 border-b pb-2">Tags</h3>

                      <div className="space-y-2">
                        <Label htmlFor="tags" className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-orange-500" />
                          Tags (Comma separated)
                        </Label>
                        <Input
                          id="tags"
                          value={Array.isArray(getValues("tags") ?? []) ? (getValues("tags") ?? []).join(", ") : ""}
                          onChange={e => setValue("tags", e.target.value.split(",").map(tag => tag.trim()).filter(Boolean))}
                          placeholder="e.g., fat-loss, hiit, beginner-friendly"
                          className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                        />
                        <p className="text-sm text-muted-foreground">Tags help users discover your program</p>
                      </div>
                    </div>

                    <div className="border-t p-4 z-50 sticky bottom-0 bg-gray-900 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="py-5 rounded-sm cursor-pointer mr-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-5 rounded-sm cursor-pointer bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {toEditProgram ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            {toEditProgram ? "Update Program" : "Create Program"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card >

      {/* Programs List */}
      <Card className="p-6 rounded-lg">
        <CardHeader className="p-0 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Programs</CardTitle>
              <CardDescription>
                {programs?.length || 0} program
                {programs?.length !== 1 ? "s" : ""} available
              </CardDescription>
            </div>
            {selectedPrograms.length > 0 && (
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
                      {selectedPrograms.length} are selected. Are you sure you
                      want to delete those programs? This action{" "}
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
                      onClick={deletePrograms}
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
          ) : programs?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No programs found. Create your first program to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {programs?.map((program: any) => (
                <Card key={program._id} className="relative overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                  <div className="p-4 flex items-start gap-4">
                    <Checkbox
                      checked={selectedPrograms.includes(program._id)}
                      onCheckedChange={() => toggleProgramSelection(program._id)}
                      className="mt-1"
                    />

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-lg group-hover:text-orange-600 transition-colors">
                            {program.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                              {program.level}
                            </span>
                            {getBadge(program?.status)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            Created: {new Date(program.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">{program.description}</p>

                      {/* Engagement Metrics */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>{program.views || 0} views</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-500">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{program.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-500">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{program.dislikes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-500">
                          <Bookmark className="h-4 w-4" />
                          <span>{program.saved || 0} saved</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Tag className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Category:</span>
                          <span>{program.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Duration:</span>
                          <span>{program.durationInWeeks} weeks</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Price:</span>
                          <span>${program.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Slots:</span>
                          <span>
                            {program.availableSlots}/{program.maxSlot} available
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Delivery:</span>
                          <span>
                            {program.isOnline && program.isInPerson
                              ? "Online & In-Person"
                              : program.isOnline
                                ? "Online"
                                : "In-Person"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <HiMiniMapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Location:</span>
                          <span>{program.location || "Online"}</span>
                        </div>
                      </div>

                      {program.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {program.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => editProgram(program)}
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100 rounded-sm"
                          >
                            <MdEdit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Program</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100 rounded-sm"
                          >
                            <MdShare className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share Program</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100 rounded-sm"
                          >
                            <MdWorkspacePremium className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Promote Program</p>
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
    </div >
  );
}
