"use client";

import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Checkbox } from '@/components/ui/checkbox';
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
  Tag,
  Utensils,
  Heart,
  Filter,
  Search,
  RotateCcw,
  Zap,
  TrendingUp,
  MessageCircle,
  Send,
  Briefcase,
  AlignLeft,
  BookOpen,
  Clock,
  BarChart2,
  Target,
  User,
  Star,
  Calendar,
  Users,
  MapPin,
  Shield,
  CheckCircle,
  Loader2,
  Award,
  DollarSign,
  Globe,
  UserCheck,
  AlertCircle,
  Eye,
  ThumbsUp,
  MessageSquare,
  Phone,
  Mail,
  FileText
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
  const userId = user?._id;

  const [openDialogPlanId, setOpenDialogPlanId] = useState<null>(null);
  const [proposalMessage, setProposalMessage] = useState<string>('');
  const [proposalMemberId, setProposalMemberId] = useState<string>('');
  const [openViewDetailsCard, setOpenViewDetailsCard] = useState<boolean>(false);
  const [programDetails, setProgramDetails] = useState(null);
  const [openEnrollModel, setOpenEnrollModel] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const [errorToast, setErrorToast] = useState<boolean>(false);

  const canEnroll = agreedToTerms && agreedToPrivacy;

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
      const response = await fetch(`${api}/create-enrollment`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ userId, programDetails }),
      });

      const resBody = await response.json();

      if (response.ok) {
        setSuccessToast(true);
        setTimeout(() => {
          setSuccessToast(false);
        }, 4000);

        window.scrollTo({ top: 0, behavior: 'smooth' })

        setProcessing(false);
        setOpenEnrollModel(false);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setErrorToast(true);
        setTimeout(() => {
          setErrorToast(false);
        }, 4000);

        setProcessing(false);
      }
    } catch (error: any) {
      window.scrollTo({ top: 0, behavior: 'smooth' })

      setErrorToast(true);
      setTimeout(() => {
        setErrorToast(false);
      }, 4000);

      setProcessing(false);
      console.log("Error: ", error);
    }
  }

  // Program Card Component
  const ProgramCard = ({ program }: { program: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-orange-300 rounded-lg shadow-sm">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-orange-200 flex-shrink-0">
              <AvatarImage
                src={program.trainerId?.avatarUrl}
                alt={program.trainerId?.fullName}
              />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-sm sm:text-base">
                {program.trainerId?.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors leading-tight">
                {program.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                <span className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                  by {program.trainerId?.fullName || "Trainer"}
                </span>
                {program.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{program.rating}</span>
                  </div>
                )}
                <Badge variant={getLevelVariant(program.level)} className="text-xs">
                  {program.level}
                </Badge>
                <Badge variant={getStatusVariant(program.status)} className="text-xs">
                  {program.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1">
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              {formatTimeAgo(program.createdAt)}
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer hover:bg-orange-50"
              >
                <ThumbsUp size={14} className="text-gray-400 hover:text-green-500" />
              </Button>
              <span className="text-xs sm:text-sm text-gray-500">{program.likes || 0}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer hover:bg-orange-50"
              >
                <Heart size={14} className="text-gray-400 hover:text-red-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">
          {program.description}
        </p>

        {/* Program Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Category:</span>
              <span className="truncate">{program.category}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Duration:</span>
              <span>{program.durationInWeeks} weeks</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Slots:</span>
              <span>{program.availableSlots}/{program.maxSlot} available</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Delivery:</span>
              <span className="truncate">
                {program.isOnline && program.isInPerson
                  ? "Online & In-Person"
                  : program.isOnline
                    ? "Online"
                    : "In-Person"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <HiMiniMapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Location:</span>
              <span className="truncate">{program.location || "Online"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Views:</span>
              <span>{program.views || 0}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {program?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
            {program.tags.map((tag: string, i: number) => (
              <Badge
                key={i}
                variant="secondary"
                className="px-2 sm:px-3 py-1 bg-orange-50 text-orange-700 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        {/* Footer Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Price and Info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <DollarSign size={14} className="sm:size-4" />
              <span className="text-lg sm:text-xl font-bold">${program.price}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={14} className="sm:size-4" />
              <span>{program.durationInWeeks} weeks</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users size={14} className="sm:size-4" />
              <span className="whitespace-nowrap">{program.availableSlots} slots left</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={() => {
                setProgramDetails(program);
                setOpenViewDetailsCard(true);
              }}
              variant="outline"
              size="sm"
              className="w-full cursor-pointer sm:w-auto border-orange-200 py-5 rounded-sm cursor-pointer text-orange-700 hover:bg-orange-50 text-sm font-medium"
            >
              View Details
            </Button>
            <Button
              onClick={() => {
                setOpenEnrollModel(true);
                setProgramDetails(program);
              }}
              size="sm"
              className="w-full cursor-pointer sm:w-auto bg-orange-500 py-5 rounded-sm cursor-pointer hover:bg-orange-600 text-sm font-medium"
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
    <Card className="group hover:shadow-xl transition-all duration-300 hover:border-orange-300 rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-orange-200 flex-shrink-0">
              <AvatarImage
                src={request.memberId?.avatarUrl}
                alt={request.memberId?.fullName}
              />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-sm sm:text-base">
                {request.memberId?.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "M"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors leading-tight mb-2">
                {request.goal}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  by {request.memberId?.fullName || "Member"}
                </span>
                <Badge variant={getStatusVariant(request.status)} className="text-xs">
                  {request.status}
                </Badge>
                {request.memberId?.memberProfile?.fitnessLevel && (
                  <Badge variant="outline" className="text-xs">
                    {request.memberId.memberProfile.fitnessLevel}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end sm:justify-start">
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              {formatTimeAgo(request.createdAt)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
          {request.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm bg-green-50 p-3 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium text-gray-700">Budget per week:</span>
                <span className="text-green-600 font-bold text-base">
                  ${request.budgetPerWeek}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm bg-blue-50 p-3 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium text-gray-700">Days per week:</span>
                <span className="text-blue-600 font-semibold">
                  {request.preferredDaysPerWeek} days
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm bg-purple-50 p-3 rounded-lg">
              <Clock className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-medium text-gray-700">Available times:</span>
                <span className="text-purple-600 font-medium text-xs">
                  {request.availableTimeSlots?.join(", ") || "Flexible"}
                </span>
              </div>
            </div>
            {request.memberId?.memberProfile?.gender && (
              <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                <User className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-700">Gender:</span>
                  <span className="text-gray-600 font-medium">
                    {request.memberId.memberProfile.gender}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Member Goals */}
        {request.memberId?.memberProfile?.goals?.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Member's Goals
            </h4>
            <div className="flex flex-wrap gap-2">
              {request.memberId.memberProfile.goals.map((goal: string, i: number) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors text-xs"
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-6 bg-gray-200" />

        {/* Footer */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-full">
              <DollarSign size={14} />
              <span>${request.budgetPerWeek}/week</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full">
              <Calendar size={14} />
              <span>{request.preferredDaysPerWeek} days/week</span>
            </div>
            {request.memberId?.memberProfile?.completedPlans && (
              <div className="flex items-center gap-2 text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-full">
                <CheckCircle size={14} />
                <span>{request.memberId.memberProfile.completedPlans} completed</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none py-5 px-4 rounded-sm cursor-pointer border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 font-medium"
            >
              View Profile
            </Button>
            <Button
              key={request._id}
              onClick={() => {
                setOpenDialogPlanId(request._id)
                setProposalMemberId(request.memberId?._id);
              }}
              size="sm"
              className="flex-1 sm:flex-none py-5 px-4 rounded-sm cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
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

        {/* Alert toast dialog */}
        {(successToast || errorToast) && (
          <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm">
            {successToast && (
              <Alert variant="success" className="bg-green-100 border-green-500 text-green-800">
                <CheckCircle2Icon className="w-5 h-5" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your enrollment was successful!
                </AlertDescription>
              </Alert>
            )}

            {errorToast && (
              <Alert variant="destructive" className="bg-red-100 border-red-500 text-red-800 mt-2">
                <CheckCircle2Icon className="w-5 h-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Proposal model */}
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

        {/* Program details model */}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <div className="grid md:grid-cols-2 gap-4">
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
                    <div className="bg-white p-4 rounded-lg border">
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

        {/* Enrollment details model */}
        <Dialog open={!!openEnrollModel} onOpenChange={() => setOpenEnrollModel(!openEnrollModel)}>
          <DialogContent className="sm:max-w-4xl max-h-[95vh] h-[95vh] flex flex-col p-0">
            {/* Sticky Header */}
            <DialogHeader className="flex-shrink-0 bg-gradient-to-r from-orange-50 to-white z-10 p-6 pb-4 border-b rounded-t-lg">
              <DialogTitle className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                <BookOpen className="w-8 h-8 text-orange-500" />
                Program Enrollment
              </DialogTitle>
              <p className="text-gray-600 mt-2">Review program details and complete your enrollment</p>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              {programDetails && (
                <div className="space-y-8">

                  {/* Program Overview Card */}
                  <div className="bg-gradient-to-br from-orange-50 via-white to-orange-25 p-8 rounded-xl border-2 border-orange-100 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{programDetails.title}</h2>
                            <p className="text-gray-700 leading-relaxed">{programDetails.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-orange-600">${programDetails.price}</div>
                            <div className="text-sm text-gray-500">Total Program Fee</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                          <div className="bg-white p-4 rounded-lg border border-orange-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-5 h-5 text-orange-500" />
                              <span className="font-semibold">Duration</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{programDetails.durationInWeeks}</span>
                            <span className="text-gray-600 ml-1">weeks</span>
                          </div>

                          <div className="bg-white p-4 rounded-lg border border-orange-100">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart2 className="w-5 h-5 text-orange-500" />
                              <span className="font-semibold">Level</span>
                            </div>
                            <Badge variant="secondary" className="text-lg py-1">{programDetails.level}</Badge>
                          </div>

                          <div className="bg-white p-4 rounded-lg border border-orange-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-5 h-5 text-orange-500" />
                              <span className="font-semibold">Focus</span>
                            </div>
                            <span className="text-lg font-medium text-gray-800">{programDetails.category}</span>
                          </div>

                          <div className="bg-white p-4 rounded-lg border border-orange-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-5 h-5 text-orange-500" />
                              <span className="font-semibold">Spots</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{programDetails.availableSlots}</span>
                            <span className="text-gray-600">/{programDetails.maxSlot}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Program Features */}
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-500" />
                      Program Features & Tags
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {programDetails.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1 bg-orange-50 text-orange-700 border-orange-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <div>
                          <span className="font-medium">Format: </span>
                          <span className={programDetails.isOnline ? "text-green-600" : "text-blue-600"}>
                            {programDetails.isOnline ? "Online" : "In-Person"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <div>
                          <span className="font-medium">Location: </span>
                          <span>{programDetails.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trainer Information */}
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-500" />
                      Meet Your Trainer
                    </h3>
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-20 w-20 border-4 border-orange-200">
                          <AvatarImage src={programDetails.trainerId?.avatarUrl} />
                          <AvatarFallback className="text-2xl">
                            {programDetails.trainerId?.fullName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-2xl font-bold text-gray-900">{programDetails.trainerId?.fullName}</h4>
                            {programDetails.trainerId?.trainerProfile?.isVerified && (
                              <UserCheck className="w-6 h-6 text-blue-500" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">{programDetails.trainerId?.trainerProfile?.bio}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold mb-2 flex items-center gap-2">
                                <Award className="w-4 h-4 text-orange-500" />
                                Expertise
                              </h5>
                              <div className="space-y-1">
                                {programDetails.trainerId?.trainerProfile?.experties?.map((expertise, index) => (
                                  <Badge key={index} variant="secondary" className="mr-1 mb-1">{expertise}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>Rating: {programDetails.trainerId?.trainerProfile?.ratings}/5</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-green-500" />
                                <span>{programDetails.trainerId?.trainerProfile?.completedPrograms} Programs Completed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Program Statistics */}
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Program Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{programDetails.views}</div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <ThumbsUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{programDetails.likes}</div>
                        <div className="text-sm text-gray-600">Likes</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{programDetails.rating}</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-800">Created</div>
                        <div className="text-xs text-gray-600">{formatDate(programDetails.createdAt)}</div>
                      </div>
                    </div>
                  </div>

                  {/* What You'll Get */}
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-500" />
                      What You'll Get
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-800">Personalized Training Plan</h4>
                          <p className="text-green-700 text-sm">Customized {programDetails.durationInWeeks}-week program tailored to your {programDetails.level.toLowerCase()} level</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800">Direct Trainer Support</h4>
                          <p className="text-blue-700 text-sm">24/7 chat support and weekly check-ins with your trainer</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-purple-800">Comprehensive Resources</h4>
                          <p className="text-purple-700 text-sm">Workout guides, nutrition plans, and progress tracking tools</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                        <Users className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-orange-800">Community Access</h4>
                          <p className="text-orange-700 text-sm">Join our supportive community of like-minded individuals</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-orange-500" />
                      Payment Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700">Program Fee ({programDetails.durationInWeeks} weeks)</span>
                        <span className="font-semibold">${programDetails.price}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700">Platform Fee</span>
                        <span className="font-semibold text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700">Taxes & Fees</span>
                        <span className="font-semibold">$0.00</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="text-xl font-bold">Total Amount</span>
                        <span className="text-2xl font-bold text-orange-600">${programDetails.price}</span>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg mt-4">
                        <p className="text-sm text-orange-800">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          One-time payment. No hidden fees or recurring charges.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-gray-600" />
                      Terms & Privacy
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={setAgreedToTerms}
                          className="mt-1 h-5 w-5 cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                          I agree to the <button className="text-orange-600 hover:underline font-medium">Terms of Service</button> and understand that this program requires commitment and active participation for {programDetails.durationInWeeks} weeks.
                        </label>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="privacy"
                          checked={agreedToPrivacy}
                          onCheckedChange={setAgreedToPrivacy}
                          className="mt-1 h-5 w-5 cursor-pointer"
                        />
                        <label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                          I acknowledge the <button className="text-orange-600 hover:underline font-medium">Privacy Policy</button> and consent to sharing my progress data with my assigned trainer for program optimization.
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <DialogFooter className="flex-shrink-0 bg-white pt-6 pb-6 px-6 border-t shadow-lg border-b-none rounded-b-lg">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => setOpenEnrollModel(false)}
                  className="py-6 px-6 text-base cursor-pointer rounded-sm font-medium border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={enrollProgram}
                  disabled={!canEnroll || processing}
                  className={`py-6 px-8 rounded-sm cursor-pointer text-base font-semibold flex-1 ${canEnroll
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Enroll Now - ${programDetails?.price}
                    </>
                  )}
                </Button>
              </div>
              {!canEnroll && (
                <p className="text-xs text-gray-500 mt-2 text-center w-full">
                  Please accept the terms and privacy policy to continue
                </p>
              )}
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

        <div className="w-full md:flex gap-6">

          {/* Main Content */}
          <div className="md:w-9/12 w-full space-y-6">
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
                <SelectTrigger className="w-48 py-5 border-orange-200 focus:border-orange-500 text-primary cursor-pointer">
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
          <div className='md:w-3/12 w-full sticky top-18 space-y-4'>
            <div className="lg:col-span-1 space-y-4">
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
                <Card className="p-4 rounded-lg shadow-sm border-orange-200">
                  <h4 className="text-sm font-medium text-gray-700">
                    Quick Actions
                  </h4>
                  <div className="space-y-2 flex flex-col">
                    {isTrainer ? (
                      <div className='space-y-2'>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full py-5 cursor-pointer border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <Briefcase size={16} className="mr-2" />
                          Create Program
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full py-5 cursor-pointer border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <MessageCircle size={16} className="mr-2" />
                          My Proposals
                        </Button>
                      </div>
                    ) : (
                      <div className='space-y-2'>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full py-5 cursor-pointer border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <Send size={16} className="mr-2" />
                          Post Request
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full py-5 cursor-pointer border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <Eye size={16} className="mr-2" />
                          My Programs
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}

            </div>

            <div className="space-y-6">
              <Card className="p-6 rounded-lg shadow-sm border-orange-200">
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
          </div>

        </div>
      </div>
    </div>
  );
}
