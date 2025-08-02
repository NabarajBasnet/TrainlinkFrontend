"use client";

import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProposalService } from "@/services/ProposalServices/ProposalServices";
import { HiMiniMapPin } from "react-icons/hi2";
import { Tag, Globe, ThumbsUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  Utensils,
  Star,
  Clock,
  DollarSign,
  Heart,
  Filter,
  Search,
  RotateCcw,
  Zap,
  Target,
  User,
  AlertCircle,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Eye,
  MessageCircle,
  Send,
  Briefcase,
  Users,
  CheckCircle,
  BookOpen,
  BarChart2,
  AlignLeft
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/components/Providers/LoggedInUser/LoggedInUserProvider";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function FindPrograms() {
  const [search, setSearch] = useState("");
  const userContext = useUser();
  const user = (userContext as any)?.user;
  const userLoading = (userContext as any)?.loading;

  const [openDialogPlanId, setOpenDialogPlanId] = useState<null>(null);
  const [proposalMessage, setProposalMessage] = useState<string>('');
  const [proposalMemberId, setProposalMemberId] = useState<string>('');
  const [openViewDetailsCard, setOpenViewDetailsCard] = useState<boolean>(false);
  const [programDetails, setProgramDetails] = useState<null>(null);
  const [openEnrollModel, setOpenEnrollModel] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  const [priceRange, setPriceRange] = useState([500]);
  const [budgetRange, setBudgetRange] = useState([500]);
  const [filters, setFilters] = useState({
    duration: "All",
    goal: "All",
    level: "All",
    category: "All",
  });
  const [sortBy, setSortBy] = useState("recommended");

  const api = process.env.NEXT_PUBLIC_API_URL;

  // Fetch programs (for members)
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ["marketplace-programs", search, filters, priceRange, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "20",
        ...(search && { search }),
        ...(filters.category !== "All" && { category: filters.category }),
        ...(filters.level !== "All" && { level: filters.level }),
        ...(priceRange[0] !== 500 && { maxPrice: priceRange[0].toString() }),
        ...(sortBy !== "recommended" && { sortBy, sortOrder: "desc" }),
      });

      const res = await fetch(`${api}/get-all-programs?${params}`);
      const data = await res.json();
      return data;
    },
    enabled: user?.role === "Member" || !user,
  });

  // Fetch training requests (for trainers)
  const { data: requestsData, isLoading: requestsLoading } = useQuery({
    queryKey: ["marketplace-requests", search, filters, budgetRange, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "20",
        ...(search && { search }),
        ...(budgetRange[0] !== 500 && { maxBudget: budgetRange[0].toString() }),
        ...(sortBy !== "recommended" && { sortBy, sortOrder: "desc" }),
      });

      const res = await fetch(`${api}/get-all-training-requests?${params}`);
      const data = await res.json();
      return data;
    },
    enabled: user?.role === "Trainer",
  });

  const programs = programsData?.programs || [];
  const trainingRequests = requestsData?.trainingRequests || [];
  const isLoading = userLoading || (user?.role === "Member" ? programsLoading : requestsLoading);

  const isTrainer = user?.role === "Trainer";
  const isMember = user?.role === "Member";
  const items = isTrainer ? trainingRequests : programs;

  const resetFilters = () => {
    setSearch("");
    setPriceRange([500]);
    setBudgetRange([500]);
    setFilters({
      duration: "All",
      goal: "All",
      level: "All",
      category: "All",
    });
    setSortBy("recommended");
  };

  const getLevelVariant = (level?: string) => {
    switch (level) {
      case "Advanced":
        return "destructive";
      case "Intermediate":
        return "secondary";
      case "Beginner":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const calculateProfileCompletion = () => {
    if (!user?.trainerProfile) return 0;
    const totalSteps = 6;
    const completedSteps = user.trainerProfile.setupStage;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Enroll program (Member only)
  const enrollProgram = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`${api}/enroll-program`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ programDetails }),
      })

      if (!response.ok) {
        setProcessing(false);
      }
    } catch (error) {
      setProcessing(false);
      console.log("Error: ", error);
      toast.error(error.message);
    }
  }

  // Program Card Component
  const ProgramCard = ({ program }: { program: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-orange-300 rounded-lg shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border-2 border-orange-200">
              <AvatarImage
                src={program.trainerId?.avatarUrl}
                alt={program.trainerId?.fullName}
              />
              <AvatarFallback className="bg-orange-100 text-orange-700">
                {program.trainerId?.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "T"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                {program.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-600 font-medium">
                  by {program.trainerId?.fullName || "Trainer"}
                </span>
                {program.rating > 0 && (
                  <div className="flex items-center gap-1 text-sm bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{program.rating}</span>
                  </div>
                )}
                <Badge variant={getLevelVariant(program.level)}>
                  {program.level}
                </Badge>
                <Badge variant={getStatusVariant(program.status)}>
                  {program.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <span className="text-sm text-gray-500">{formatTimeAgo(program.createdAt)}</span>
              <div className="flex items-center gap-1 mt-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer hover:bg-orange-50"
                >
                  <ThumbsUp size={16} className="text-gray-400 hover:text-green-500" />
                </Button>
                <span className="text-sm text-gray-500">{program.likes || 0}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer hover:bg-orange-50"
                >
                  <Heart size={16} className="text-gray-400 hover:text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
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
              <Users className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Slots:</span>
              <span>{program.availableSlots}/{program.maxSlot} available</span>
            </div>
          </div>
          <div className="space-y-2">
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
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Views:</span>
              <span>{program.views || 0}</span>
            </div>
          </div>
        </div>

        {program?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {program.tags.map((tag: string, i: number) => (
              <Badge
                key={i}
                variant="secondary"
                className="px-3 py-1 bg-orange-50 text-orange-700"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <DollarSign size={16} />
              <span>${program.price}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={16} />
              <span>{program.durationInWeeks} weeks</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users size={16} />
              <span>{program.availableSlots} slots left</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setProgramDetails(program);
                setOpenViewDetailsCard(true)
              }}
              variant="outline"
              size="sm"
              className="border-orange-200 py-5 cursor-pointer text-orange-700 hover:bg-orange-50"
            >
              View Details
            </Button>
            <Button
              onClick={() => {
                setOpenEnrollModel(true);
                setProgramDetails(program);
              }}
              size="sm"
              className="bg-orange-500 py-5 cursor-pointer hover:bg-orange-600"
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleSendProposal = async () => {
    await ProposalService.sendProposal({
      memberId: proposalMemberId,
      planId: openDialogPlanId,
      message: proposalMessage,
    });
    setProposalMessage("");
    setOpenDialogPlanId(null);
  };

  // Training Request Card Component  
  const TrainingRequestCard = ({ request }: { request: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-orange-300 rounded-lg shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border-2 border-orange-200">
              <AvatarImage
                src={request.memberId?.avatarUrl}
                alt={request.memberId?.fullName}
              />
              <AvatarFallback className="bg-orange-100 text-orange-700">
                {request.memberId?.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "M"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                {request.goal}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-600 font-medium">
                  by {request.memberId?.fullName || "Member"}
                </span>
                <Badge variant={getStatusVariant(request.status)}>
                  {request.status}
                </Badge>
                {request.memberId?.memberProfile?.fitnessLevel && (
                  <Badge variant="outline">
                    {request.memberId.memberProfile.fitnessLevel}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{formatTimeAgo(request.createdAt)}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 leading-relaxed">{request.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Budget per week:</span>
              <span className="text-green-600 font-semibold">${request.budgetPerWeek}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Days per week:</span>
              <span>{request.preferredDaysPerWeek} days</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Available times:</span>
              <span>{request.availableTimeSlots?.join(", ") || "Flexible"}</span>
            </div>
            {request.memberId?.memberProfile?.gender && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Gender:</span>
                <span>{request.memberId.memberProfile.gender}</span>
              </div>
            )}
          </div>
        </div>

        {request.memberId?.memberProfile?.goals?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Member's Goals:</h4>
            <div className="flex flex-wrap gap-2">
              {request.memberId.memberProfile.goals.map((goal: string, i: number) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="px-3 py-1 bg-orange-50 text-orange-700"
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <DollarSign size={16} />
              <span>${request.budgetPerWeek}/week</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={16} />
              <span>{request.preferredDaysPerWeek} days/week</span>
            </div>
            {request.memberId?.memberProfile?.completedPlans && (
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle size={16} />
                <span>{request.memberId.memberProfile.completedPlans} completed</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="py-5 border-orange-200 cursor-pointer text-orange-700 hover:bg-orange-50"
            >
              View Profile
            </Button>
            <Button
              key={request._id} onClick={() => {
                setOpenDialogPlanId(request._id)
                setProposalMemberId(request.memberId?._id);
              }}
              size="sm"
              className="py-5 bg-orange-500 cursor-pointer hover:bg-orange-600"
            >
              Send Proposal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full px-4 py-8">

        <Dialog open={!!openDialogPlanId} onOpenChange={(open) => !open && setOpenDialogPlanId(null)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Send Proposal</DialogTitle>
              <DialogDescription>
                Write a short message explaining your offer to the member.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                placeholder="Hi, I’d love to help you with your transformation journey..."
                className="min-h-[100px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" className="py-5 rounded-sm cursor-pointer" onClick={() => setOpenDialogPlanId(null)}>
                Cancel
              </Button>
              <Button disabled={!proposalMemberId} onClick={handleSendProposal} className="py-5 rounded-sm cursor-pointer bg-orange-500 hover:bg-orange-600">
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!openViewDetailsCard} onOpenChange={() => setOpenViewDetailsCard(!openViewDetailsCard)}>
          <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-orange-500" />
                Program Details
              </DialogTitle>
            </DialogHeader>

            {programDetails && (
              <div className="space-y-8">
                {/* Program Header */}
                <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-lg border">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h1 className="text-3xl font-bold text-orange-600 leading-tight">
                        {programDetails.title}
                      </h1>
                      <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColor(programDetails.status)}`}>
                        {programDetails.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{programDetails.trainerId?.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{programDetails.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" />
                        <span className="capitalize">{programDetails.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{programDetails.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p className="text-lg font-bold text-gray-900">{programDetails.durationInWeeks} weeks</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Available Slots</p>
                        <p className="text-lg font-bold text-gray-900">
                          {programDetails.availableSlots}/{programDetails.maxSlot}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Price</p>
                        <p className="text-lg font-bold text-gray-900">${programDetails.price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Rating</p>
                        <p className="text-lg font-bold text-gray-900">
                          {programDetails.rating > 0 ? `${programDetails.rating}/5` : 'Not rated'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Information */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlignLeft className="w-5 h-5 text-gray-600" />
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{programDetails.description}</p>
                    </div>

                    {/* Program Details */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4">Program Information</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{programDetails.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">
                            {programDetails.isOnline && (
                              <Badge variant="outline" className="mr-2">
                                <Globe className="w-3 h-3 mr-1" />
                                Online
                              </Badge>
                            )}
                            {programDetails.isInPerson && (
                              <Badge variant="outline">
                                <MapPinIcon className="w-3 h-3 mr-1" />
                                In-person
                              </Badge>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{formatDate(programDetails.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-medium">{formatDate(programDetails.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4">Engagement</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{programDetails.likes}</p>
                          <p className="text-sm text-gray-600">Likes</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">{programDetails.dislikes}</p>
                          <p className="text-sm text-gray-600">Dislikes</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{programDetails.views}</p>
                          <p className="text-sm text-gray-600">Views</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Tags */}
                    {programDetails.tags && programDetails.tags.length > 0 && (
                      <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-gray-600" />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {programDetails.tags.map((tag, index) => (
                            <Badge key={index} variant="default" className="px-3 py-1">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trainer Information */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-600" />
                        Trainer Information
                      </h3>

                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-16 w-16 border-2 border-gray-200">
                          <AvatarImage src={programDetails.trainerId?.avatarUrl} />
                          <AvatarFallback className="text-lg font-semibold">
                            {programDetails.trainerId?.fullName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xl font-semibold text-gray-900">
                              {programDetails.trainerId?.fullName}
                            </h4>
                            {programDetails.trainerId?.trainerProfile?.isVerified && (
                              <Shield className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{programDetails.trainerId?.email}</p>
                          <p className="text-gray-700 leading-relaxed">
                            {programDetails.trainerId?.trainerProfile?.bio}
                          </p>
                        </div>
                      </div>

                      {/* Trainer Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {programDetails.trainerId?.trainerProfile?.completedPrograms}
                          </p>
                          <p className="text-sm text-gray-600">Programs Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {programDetails.trainerId?.trainerProfile?.ratings}/5
                          </p>
                          <p className="text-sm text-gray-600">Trainer Rating</p>
                        </div>
                      </div>

                      {/* Expertise */}
                      {programDetails.trainerId?.trainerProfile?.experties && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Expertise</h5>
                          <div className="flex flex-wrap gap-2">
                            {programDetails.trainerId.trainerProfile.experties.map((exp, index) => (
                              <Badge key={index} variant="default" className="">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {programDetails.trainerId?.trainerProfile?.certifications &&
                        programDetails.trainerId.trainerProfile.certifications.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Certifications
                            </h5>
                            <div className="space-y-2">
                              {programDetails.trainerId.trainerProfile.certifications.map((cert, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium text-gray-900">{cert.name}</p>
                                      <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium text-gray-900">{cert.yearObtained}</p>
                                      {cert.isVerified && (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                          Verified
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!openEnrollModel} onOpenChange={() => setOpenEnrollModel(!openEnrollModel)}>
          <DialogContent className="sm:max-w-2xl max-h-[95vh] h-[95vh] flex flex-col p-0">
            {/* Sticky Header */}
            <DialogHeader className="flex-shrink-0 bg-background z-10 p-6 pb-4 border-b">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-orange-500" />
                Confirm Enrollment
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4 px-6 min-h-0">
              {programDetails && (
                <div className="space-y-8">
                  {/* Program Summary */}
                  <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-lg border">
                    <h2 className="text-2xl font-bold text-orange-600 mb-2">{programDetails.title}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span>{programDetails.durationInWeeks} weeks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-gray-600" />
                        <span className="capitalize">{programDetails.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-600" />
                        <span>{programDetails.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trainer Information */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      Your Trainer
                    </h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-orange-200">
                        <AvatarImage src={programDetails.trainerId?.avatarUrl} />
                        <AvatarFallback>
                          {programDetails.trainerId?.fullName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-lg font-bold">{programDetails.trainerId?.fullName}</h4>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {programDetails.trainerId?.trainerProfile?.bio || "Certified fitness trainer"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Program Highlights */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-gray-600" />
                      Program Highlights
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <div>
                          <h4 className="font-medium">Weekly Sessions</h4>
                          <p className="text-gray-600 text-sm">3-5 sessions per week based on your level</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Utensils className="w-5 h-5 text-orange-500" />
                        <div>
                          <h4 className="font-medium">Meal Plans</h4>
                          <p className="text-gray-600 text-sm">Customized nutrition guidance included</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-orange-500" />
                        <div>
                          <h4 className="font-medium">24/7 Support</h4>
                          <p className="text-gray-600 text-sm">Direct chat with trainer and community</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Program Fee</span>
                        <span className="font-medium">${programDetails.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-orange-600">${programDetails.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <DialogFooter className="flex-shrink-0 bg-background pt-4 pb-6 px-6 border-t">
              <Button
                variant="outline"
                onClick={() => setOpenEnrollModel(false)}
                className="py-5 rounded-sm cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={enrollProgram}
                className="py-5 rounded-sm cursor-pointer bg-orange-500 hover:bg-orange-600"
              >
                {processing ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {processing ? 'Processing...' : 'Confirm Enrollment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-full text-white text-sm font-medium">
            <Zap size={16} />
            {isTrainer ? "Find Training Opportunities" : "Find Your Perfect Trainer"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold py-4 bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
            {isTrainer ? "Training Requests Marketplace" : "Expert Fitness Programs"}
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto">
            {isTrainer
              ? "Connect with members looking for personalized training programs"
              : "Connect with certified trainers and transform your fitness journey"}
          </p>
        </header>

        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 sticky top-18 rounded-lg shadow-sm border-orange-200">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-orange-700">
                    <Filter size={18} />
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <RotateCcw size={14} className="mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="px-0 space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Search {isTrainer ? "Requests" : "Programs"}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={
                        isTrainer
                          ? "Goal, description, or keyword..."
                          : "Title, trainer, or keyword..."
                      }
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 border-orange-200 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Price/Budget Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    {isTrainer ? "Maximum Budget per Week" : "Maximum Price"}
                  </label>
                  <div className="px-3">
                    <Slider
                      value={isTrainer ? budgetRange : priceRange}
                      onValueChange={isTrainer ? setBudgetRange : setPriceRange}
                      max={500}
                      min={50}
                      step={25}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>$50</span>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span className="font-medium text-orange-600">
                        {isTrainer ? budgetRange[0] : priceRange[0]}
                      </span>
                    </div>
                    <span>$500+</span>
                  </div>
                </div>

                {/* Category Filter - Only for members */}
                {!isTrainer && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger className="border-orange-200 focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                        <SelectItem value="Fat loss">Fat Loss</SelectItem>
                        <SelectItem value="Strength Training">Strength Training</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="Nutrition">Nutrition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Level Filter - Only for members */}
                {!isTrainer && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Experience Level</label>
                    <Select
                      value={filters.level}
                      onValueChange={(value) => setFilters({ ...filters, level: value })}
                    >
                      <SelectTrigger className="border-orange-200 focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Results Count and Sort */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={20} className="text-primary" />
                <p className="text-sm font-medium text-primary">
                  <span className="text-primary font-bold">{items.length}</span>{" "}
                  {isTrainer ? "requests" : "programs"} found
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-orange-200 focus:border-orange-500 text-primary cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended" className="cursor-pointer">
                    Recommended
                  </SelectItem>
                  <SelectItem value="rating" className="cursor-pointer">
                    Highest Rated
                  </SelectItem>
                  <SelectItem value="price-low" className="cursor-pointer">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high" className="cursor-pointer">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="newest" className="cursor-pointer">
                    Newest First
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6 rounded-lg shadow-sm">
                    <div className="flex gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Items Feed */}
            {!isLoading && (
              <div className="space-y-4">
                {items?.length > 0 ? (
                  items?.map((item: any) => (
                    <div key={item._id}>
                      {isTrainer ? (
                        <TrainingRequestCard request={item} />
                      ) : (
                        <ProgramCard program={item} />
                      )}
                    </div>
                  ))
                ) : (
                  <Card className="p-12 text-center rounded-lg shadow-sm">
                    <div className="mx-auto max-w-md">
                      <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                        <Search size={32} className="text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        No {isTrainer ? "requests" : "programs"} found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your search criteria or explore different filter options
                        to discover the perfect {isTrainer ? "training opportunity" : "fitness program"} for you.
                      </p>
                      <Button
                        onClick={resetFilters}
                        variant="outline"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        <RotateCcw size={16} className="mr-2" />
                        Reset All Filters
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Profile Sidebar */}
          <div>
            <div className="sticky top-18 lg:col-span-1 space-y-4">
              <Card className="p-6 rounded-lg shadow-sm border-orange-200">
                {userLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[80px]" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-orange-200">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-orange-100 text-orange-700">
                          {user.fullName
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge
                          variant="outline"
                          className="mt-1 text-orange-700 border-orange-300"
                        >
                          {user.role}
                        </Badge>
                      </div>
                    </div>

                    {user.trainerProfile && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-700">
                            Profile Completion
                          </h4>
                          <span className="text-sm font-medium text-orange-600">
                            {calculateProfileCompletion()}%
                          </span>
                        </div>
                        <Progress
                          value={calculateProfileCompletion()}
                          className="h-2"
                        />

                        {user.trainerProfile.setupStage <= 6 && (
                          <div className="mt-4">
                            <Link href="/dashboard/profile">
                              <Button
                                variant="default"
                                className="w-full bg-orange-500 hover:bg-orange-600"
                              >
                                Complete Your Profile
                              </Button>
                            </Link>
                            {calculateProfileCompletion() < 50 && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-yellow-600">
                                <AlertCircle size={16} />
                                <span>
                                  Complete your profile to get more clients
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {user.memberProfile && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle size={16} className="text-green-500" />
                          <span>
                            {user?.memberProfile?.completedPlans || 0} plans
                            completed
                          </span>
                        </div>
                        <Link href="/dashboard/profile">
                          <Button
                            variant="outline"
                            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            Update Profile
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <User size={48} className="mx-auto text-gray-400" />
                    <p className="text-gray-600">
                      Please sign in to view your profile
                    </p>
                    <Link href="/auth">
                      <Button
                        variant="default"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>

              {/* Quick Stats */}
              {user && (
                <Card className="p-6 rounded-lg shadow-sm border-orange-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Quick Stats
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {isTrainer ? "Active Proposals" : "Enrolled Programs"}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {isTrainer
                          ? user.trainerProfile?.clients || 0
                          : user.memberProfile?.completedPlans || 0
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {isTrainer ? "Completed Programs" : "Active Programs"}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {isTrainer
                          ? user.trainerProfile?.completedPrograms || 0
                          : "0"
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {isTrainer ? "Years Experience" : "Fitness Level"}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {isTrainer
                          ? `${user.trainerProfile?.yearsOfExperience || 0}y`
                          : user.memberProfile?.fitnessLevel || "Beginner"
                        }
                      </span>
                    </div>
                    {isTrainer && user.trainerProfile?.ratings && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-orange-600">
                            {user.trainerProfile.ratings}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Action Cards */}
              {user && (
                <Card className="p-6 rounded-lg shadow-sm border-orange-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    {isTrainer ? (
                      <>
                        <Link href="/dashboard/programs/create">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            <Briefcase size={16} className="mr-2" />
                            Create Program
                          </Button>
                        </Link>
                        <Link href="/dashboard/proposals">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            <MessageCircle size={16} className="mr-2" />
                            My Proposals
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/dashboard/requests/create">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            <Send size={16} className="mr-2" />
                            Post Request
                          </Button>
                        </Link>
                        <Link href="/dashboard/programs">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            <Eye size={16} className="mr-2" />
                            My Programs
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </Card>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
