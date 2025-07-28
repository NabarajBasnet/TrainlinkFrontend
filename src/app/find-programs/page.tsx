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
import { Tag, Globe, ThumbsUp } from "lucide-react";
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

  const isTrainer = user?.role === "Trainer";
  const isMember = user?.role === "Member";
  const items = isTrainer ? trainingRequests : programs;

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
              variant="outline"
              size="sm"
              className="border-orange-200 py-5 cursor-pointer text-orange-700 hover:bg-orange-50"
            >
              View Details
            </Button>
            <Button
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
    <div className="w-full min-h-screen bg-orange-500">
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

        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full text-white text-sm font-medium">
            <Zap size={16} />
            {isTrainer ? "Find Training Opportunities" : "Find Your Perfect Trainer"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold py-4 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
            {isTrainer ? "Training Requests Marketplace" : "Expert Fitness Programs"}
          </h1>
          <p className="text-xl text-gray-600 text-white max-w-2xl mx-auto">
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
                <Target size={20} className="text-white" />
                <p className="text-sm font-medium text-white">
                  <span className="text-white font-bold">{items.length}</span>{" "}
                  {isTrainer ? "requests" : "programs"} found
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-orange-200 focus:border-orange-500 text-white cursor-pointer">
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
