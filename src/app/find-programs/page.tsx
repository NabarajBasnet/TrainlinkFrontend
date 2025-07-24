"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, DollarSign, Heart, Filter, Search, RotateCcw, Zap, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Program {
    id: string;
    title: string;
    trainerName: string;
    trainerAvatar?: string;
    description: string;
    price: number;
    tags: string[];
    duration: string;
    createdAt: string;
    rating?: number;
    reviews?: number;
    level?: "Beginner" | "Intermediate" | "Advanced";
    isFavorite?: boolean;
}

const dummyPrograms: Program[] = [
    {
        id: "1",
        title: "Fat Burn Bootcamp",
        trainerName: "Alex Johnson",
        trainerAvatar: "https://i.pravatar.cc/100?img=5",
        description: "An intense HIIT and diet-focused 6-week bootcamp to shred fat quickly with a proven method used by athletes.",
        price: 150,
        tags: ["Weight Loss", "HIIT", "Beginner Friendly"],
        duration: "6 Weeks",
        createdAt: "3 days ago",
        rating: 4.8,
        reviews: 124,
        level: "Beginner",
        isFavorite: false
    },
    {
        id: "2",
        title: "Muscle Gain 101",
        trainerName: "Rita Gomez",
        trainerAvatar: "https://i.pravatar.cc/100?img=10",
        description: "Designed for hypertrophy with split routines, progressive overload tracking, and weekly check-ins.",
        price: 200,
        tags: ["Strength", "Hypertrophy", "Advanced"],
        duration: "8 Weeks",
        createdAt: "1 week ago",
        rating: 4.9,
        reviews: 87,
        level: "Advanced",
        isFavorite: true
    },
    {
        id: "3",
        title: "Yoga for Flexibility",
        trainerName: "Priya Patel",
        trainerAvatar: "https://i.pravatar.cc/100?img=15",
        description: "Improve your flexibility and mobility with this 4-week yoga program designed for all levels.",
        price: 120,
        tags: ["Yoga", "Flexibility", "Mindfulness"],
        duration: "4 Weeks",
        createdAt: "2 days ago",
        rating: 4.7,
        reviews: 56,
        level: "Intermediate",
        isFavorite: false
    },
    {
        id: "4",
        title: "Endurance Running",
        trainerName: "Marcus Chen",
        trainerAvatar: "https://i.pravatar.cc/100?img=20",
        description: "Build stamina and improve your running technique with this 10-week progressive program.",
        price: 180,
        tags: ["Running", "Cardio", "Endurance"],
        duration: "10 Weeks",
        createdAt: "5 days ago",
        rating: 4.6,
        reviews: 42,
        level: "Intermediate",
        isFavorite: false
    },
    {
        id: "5",
        title: "Strength Training Fundamentals",
        trainerName: "Jordan Smith",
        trainerAvatar: "https://i.pravatar.cc/100?img=25",
        description: "Learn proper form and technique while building functional strength with this comprehensive program.",
        price: 160,
        tags: ["Strength", "Form", "Fundamentals"],
        duration: "8 Weeks",
        createdAt: "1 day ago",
        rating: 4.9,
        reviews: 203,
        level: "Beginner",
        isFavorite: false
    }
];

export default function FindPrograms() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState([500]);
    const [filters, setFilters] = useState({
        duration: "All",
        goal: "All",
        level: "All"
    });

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setPrograms(dummyPrograms);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const toggleFavorite = (id: string) => {
        setPrograms(programs.map(program =>
            program.id === id ? { ...program, isFavorite: !program.isFavorite } : program
        ));
    };

    const resetFilters = () => {
        setSearch("");
        setPriceRange([500]);
        setFilters({
            duration: "All",
            goal: "All",
            level: "All"
        });
    };

    const filtered = programs.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()) ||
            p.trainerName.toLowerCase().includes(search.toLowerCase());

        const matchesDuration = filters.duration === "All" ||
            (filters.duration === "4 Weeks" && p.duration.includes("4")) ||
            (filters.duration === "6 Weeks" && p.duration.includes("6")) ||
            (filters.duration === "8+ Weeks" && parseInt(p.duration) >= 8);

        const matchesGoal = filters.goal === "All" ||
            p.tags.some(tag =>
                tag.toLowerCase().includes(filters.goal.toLowerCase().replace(" ", ""))
            );

        const matchesLevel = filters.level === "All" || p.level === filters.level;
        const matchesPrice = p.price <= priceRange[0];

        return matchesSearch && matchesDuration && matchesGoal && matchesLevel && matchesPrice;
    });

    const getLevelVariant = (level?: string) => {
        switch (level) {
            case "Advanced": return "destructive";
            case "Intermediate": return "secondary";
            case "Beginner": return "outline";
            default: return "secondary";
        }
    };

    return (
        <div className="min-h-screen bg-orange-500">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium">
                        <Zap size={16} />
                        Find Your Perfect Trainer
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Discover Expert Fitness Programs
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Connect with certified trainers and transform your fitness journey with personalized programs
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1 space-y-6">
                        <Card className="p-6 sticky top-18 rounded-sm">
                            <CardHeader className="px-0 pt-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <Filter size={18} className="text-primary" />
                                        Filters
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={resetFilters}
                                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                    >
                                        <RotateCcw size={14} className="mr-1" />
                                        Reset
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="px-0 space-y-6">
                                {/* Search */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Search Programs</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Title, trainer, or keyword..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Maximum Price</label>
                                    <div className="px-3">
                                        <Slider
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            max={500}
                                            min={50}
                                            step={25}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>$50</span>
                                        <div className="flex items-center gap-1">
                                            <DollarSign size={14} />
                                            <span className="font-medium text-primary">{priceRange[0]}</span>
                                        </div>
                                        <span>$500+</span>
                                    </div>
                                </div>

                                {/* Duration Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Program Duration</label>
                                    <Select value={filters.duration} onValueChange={(value) => setFilters({ ...filters, duration: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Durations</SelectItem>
                                            <SelectItem value="4 Weeks">4 Weeks</SelectItem>
                                            <SelectItem value="6 Weeks">6 Weeks</SelectItem>
                                            <SelectItem value="8+ Weeks">8+ Weeks</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Goal Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Fitness Goal</label>
                                    <Select value={filters.goal} onValueChange={(value) => setFilters({ ...filters, goal: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Goals</SelectItem>
                                            <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                            <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                            <SelectItem value="Strength">Strength Training</SelectItem>
                                            <SelectItem value="Endurance">Endurance</SelectItem>
                                            <SelectItem value="Flexibility">Flexibility</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Level Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Experience Level</label>
                                    <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
                                        <SelectTrigger>
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
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3 space-y-6">
                        {/* Results Count */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Target size={20} className="text-white" />
                                <p className="text-sm font-medium text-white">
                                    <span className="text-white font-bold">{filtered.length}</span> programs found
                                </p>
                            </div>
                            <Select defaultValue="recommended">
                                <SelectTrigger className="w-48 text-white bg-transparent cursor-pointer shadow-none border-none outline-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recommended">Recommended</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <Card key={i} className="p-6">
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

                        {/* Program Feed */}
                        {!loading && (
                            <div className="space-y-4">
                                {filtered.length > 0 ? (
                                    filtered.map((program) => (
                                        <Card key={program.id} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20 rounded-sm">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                                            <AvatarImage src={program.trainerAvatar} alt={program.trainerName} />
                                                            <AvatarFallback>{program.trainerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                                {program.title}
                                                            </h3>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-sm text-muted-foreground font-medium">
                                                                    by {program.trainerName}
                                                                </span>
                                                                {program.rating && (
                                                                    <div className="flex items-center gap-1 text-sm bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-full">
                                                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                                                        <span className="font-medium">{program.rating}</span>
                                                                        <span className="text-yellow-600">({program.reviews})</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">{program.createdAt}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => toggleFavorite(program.id)}
                                                        >
                                                            <Heart
                                                                size={16}
                                                                className={program.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <p className="text-muted-foreground mb-4 leading-relaxed">{program.description}</p>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {program.tags.map((tag, i) => (
                                                        <Badge key={i} variant="secondary" className="px-3 py-1">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {program.level && (
                                                        <Badge variant={getLevelVariant(program.level)}>
                                                            {program.level}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <Separator className="my-4" />

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-6 text-sm">
                                                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                                                            <DollarSign size={16} />
                                                            <span>${program.price}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Clock size={16} />
                                                            <span>{program.duration}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <Button variant="outline" size="sm">
                                                            View Details
                                                        </Button>
                                                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                                                            Enroll Now
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="p-12 text-center">
                                        <div className="mx-auto max-w-md">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Search size={32} className="text-primary" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">No programs found</h3>
                                            <p className="text-muted-foreground mb-6">
                                                Try adjusting your search criteria or explore different filter options to discover the perfect fitness program for you.
                                            </p>
                                            <Button onClick={resetFilters} variant="outline">
                                                <RotateCcw size={16} className="mr-2" />
                                                Reset All Filters
                                            </Button>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}