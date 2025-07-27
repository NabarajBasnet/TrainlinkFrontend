"use client";

import { useState, useEffect } from "react";
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

interface Program {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationInWeeks: number;
  price: number;
  maxSlot: number;
  availableSlots: number;
  goals: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  equipment: string[];
  coverImage?: string;
  images: string[];
  videoUrl?: string;
  rating: number;
  totalReviews: number;
  views: number;
  favorites: string[];
  enrollments: string[];
  location?: string;
  isOnline: boolean;
  isInPerson: boolean;
  tags: string[];
  schedule: {
    daysPerWeek: number;
    sessionsPerDay: number;
    sessionDuration: number;
    timeSlots: string[];
  };
  trainerId: {
    _id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    trainerProfile?: {
      bio: string;
      experties: string[];
      yearsOfExperience: number;
      priceRange: number;
      clients: number;
      completedPrograms: number;
      location: string;
      availability: string[];
      ratings: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface TrainingRequest {
  _id: string;
  goal: string;
  description: string;
  preferredDaysPerWeek: number;
  budgetPerWeek: number;
  availableTimeSlots: string[];
  status: "Active" | "Inactive" | "Disabled" | "Pending";
  memberId: {
    _id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    memberProfile?: {
      goals: string[];
      fitnessLevel: string;
      fitnessJourney: string;
      gender?: "Male" | "Female" | "Other";
      healthCondition: string;
      preferredTrainingStyle?: string;
      completedPlans: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export default function FindPrograms() {
  const [search, setSearch] = useState("");
  const userContext = useUser();
  const user = (userContext as any)?.user;
  const userLoading = (userContext as any)?.loading;

  const [priceRange, setPriceRange] = useState([500]);
  const [budgetRange, setBudgetRange] = useState([500]);
  const [filters, setFilters] = useState({
    duration: "All",
    goal: "All",
    level: "All",
    category: "All",
  });
  const [loading, setLoading] = useState(true);
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
  const isLoading =
    userLoading ||
    (user?.role === "Member" ? programsLoading : requestsLoading);

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
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const isTrainer = user?.role === "Trainer";
  const isMember = user?.role === "Member";
  const items = isTrainer ? trainingRequests : programs;

  return (
    <div className="w-full min-h-screen bg-orange-500">
      <div className="w-full px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full text-white text-sm font-medium">
            <Zap size={16} />
            {isTrainer
              ? "Find Training Opportunities"
              : "Find Your Perfect Trainer"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold py-4 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
            {isTrainer
              ? "Training Requests Marketplace"
              : "Expert Fitness Programs"}
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

                {/* Category Filter */}
                {!isTrainer && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        setFilters({ ...filters, category: value })
                      }
                    >
                      <SelectTrigger className="border-orange-200 focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                        <SelectItem value="Strength Training">
                          Strength Training
                        </SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="Nutrition">Nutrition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Level Filter */}
                {!isTrainer && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Experience Level
                    </label>
                    <Select
                      value={filters.level}
                      onValueChange={(value) =>
                        setFilters({ ...filters, level: value })
                      }
                    >
                      <SelectTrigger className="border-orange-200 focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
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
                {items.length > 0 ? (
                  items.map((item: any) => (
                    <Card
                      key={item._id}
                      className="group hover:shadow-lg transition-all duration-300 hover:border-orange-300 rounded-lg shadow-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border-2 border-orange-200">
                              <AvatarImage
                                src={
                                  isTrainer
                                    ? item.memberId?.avatarUrl
                                    : item.trainerId?.avatarUrl
                                }
                                alt={
                                  isTrainer
                                    ? item.memberId?.fullName
                                    : item.trainerId?.fullName
                                }
                              />
                              <AvatarFallback className="bg-orange-100 text-orange-700">
                                {(isTrainer
                                  ? item.memberId?.fullName
                                  : item.trainerId?.fullName
                                )
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                                {isTrainer ? item.goal : item.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-600 font-medium">
                                  by{" "}
                                  {isTrainer
                                    ? item.memberId?.fullName
                                    : item.trainerId?.fullName}
                                </span>
                                {!isTrainer && item.rating > 0 && (
                                  <div className="flex items-center gap-1 text-sm bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full">
                                    <Star
                                      size={12}
                                      className="fill-yellow-400 text-yellow-400"
                                    />
                                    <span className="font-medium">
                                      {item.rating}
                                    </span>
                                    <span className="text-yellow-600">
                                      ({item.totalReviews})
                                    </span>
                                  </div>
                                )}
                                <Badge
                                  variant={
                                    isTrainer
                                      ? getStatusVariant(item.status)
                                      : getLevelVariant(item.level)
                                  }
                                >
                                  {isTrainer ? item.status : item.level}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(item.createdAt)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-orange-50 cursor-pointer"
                            >
                              <Heart
                                size={16}
                                className="text-gray-400 hover:text-red-500"
                              />
                            </Button>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {isTrainer ? item.description : item.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {isTrainer ? (
                            <>
                              <Badge
                                variant="secondary"
                                className="px-3 py-1 bg-blue-50 text-blue-700"
                              >
                                {item.preferredDaysPerWeek} days/week
                              </Badge>
                              {item.availableTimeSlots?.map(
                                (slot: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="px-3 py-1"
                                  >
                                    {slot}
                                  </Badge>
                                )
                              )}
                            </>
                          ) : (
                            <>
                              {item.tags?.map((tag: string, i: number) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="px-3 py-1"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {item.category && (
                                <Badge variant="outline" className="px-3 py-1">
                                  {item.category}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-green-600 font-semibold">
                              <DollarSign size={16} />
                              <span>
                                ${isTrainer ? item.budgetPerWeek : item.price}
                              </span>
                              {isTrainer && (
                                <span className="text-gray-500">/week</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock size={16} />
                              <span>
                                {isTrainer
                                  ? `${item.preferredDaysPerWeek} days/week`
                                  : `${item.durationInWeeks} weeks`}
                              </span>
                            </div>
                            {!isTrainer && (
                              <div className="flex items-center gap-2 text-gray-500">
                                <Users size={16} />
                                <span>{item.availableSlots} slots left</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-orange-200 cursor-pointer text-orange-700 hover:bg-orange-50"
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="cursor-pointer bg-orange-500 hover:bg-orange-600"
                            >
                              {isTrainer ? "Send Proposal" : "Enroll Now"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                        Try adjusting your search criteria or explore different
                        filter options to discover the perfect{" "}
                        {isTrainer ? "training opportunity" : "fitness program"}{" "}
                        for you.
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
                            {user.memberProfile.completedPlans || 0} plans
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
                      <span className="text-sm text-gray-600">Total Views</span>
                      <span className="text-sm font-medium text-orange-600">
                        {isTrainer ? "0" : "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Active {isTrainer ? "Requests" : "Programs"}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {isTrainer ? "0" : "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="text-sm font-medium text-orange-600">
                        {isTrainer ? "0" : "0"}
                      </span>
                    </div>
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
