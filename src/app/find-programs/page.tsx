"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign, Heart, Filter, Search, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    }
];

export default function FindPrograms() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        duration: "All",
        goal: "All",
        level: "All",
        priceRange: [0, 500]
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

    const filtered = programs.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());

        const matchesDuration = filters.duration === "All" ||
            (filters.duration === "4 Weeks" && p.duration.includes("4")) ||
            (filters.duration === "6 Weeks" && p.duration.includes("6")) ||
            (filters.duration === "8+ Weeks" && parseInt(p.duration) >= 8);

        const matchesGoal = filters.goal === "All" ||
            p.tags.some(tag =>
                tag.toLowerCase().includes(filters.goal.toLowerCase().replace(" ", ""))
            );

        const matchesLevel = filters.level === "All" || p.level === filters.level;

        const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];

        return matchesSearch && matchesDuration && matchesGoal && matchesLevel && matchesPrice;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 text-gray-800 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-orange-800 mb-2">Find Your Perfect Fitness Program</h1>
                    <p className="text-gray-600">Browse our curated selection of professional training programs</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1 sticky top-24 h-fit space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Filter size={18} /> Filters
                            </h2>
                            <Button variant="ghost" size="sm" className="text-orange-600">
                                Reset
                            </Button>
                        </div>

                        {/* Search inside filters */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search programs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9"
                            />
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Price Range</label>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">${filters.priceRange[0]}</span>
                                <span className="text-sm text-gray-500">${filters.priceRange[1]}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="500"
                                value={filters.priceRange[1]}
                                onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Duration Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Duration</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                value={filters.duration}
                                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                            >
                                <option>All</option>
                                <option>4 Weeks</option>
                                <option>6 Weeks</option>
                                <option>8+ Weeks</option>
                            </select>
                        </div>

                        {/* Goal Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Goal</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                value={filters.goal}
                                onChange={(e) => setFilters({ ...filters, goal: e.target.value })}
                            >
                                <option>All</option>
                                <option>Fat Loss</option>
                                <option>Muscle Gain</option>
                                <option>Endurance</option>
                                <option>Flexibility</option>
                            </select>
                        </div>

                        {/* Level Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Experience Level</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                value={filters.level}
                                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                            >
                                <option>All</option>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3 space-y-6">
                        {/* Results Count */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-medium">{filtered.length}</span> programs
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Sort by:</span>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                    Recommended <ChevronDown size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
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
                                ))}
                            </div>
                        )}

                        {/* Program Feed */}
                        {!loading && (
                            <div className="space-y-4">
                                {filtered.length > 0 ? (
                                    filtered.map((program) => (
                                        <div
                                            key={program.id}
                                            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-4">
                                                    <img
                                                        src={program.trainerAvatar}
                                                        alt="trainer"
                                                        className="w-12 h-12 rounded-full border-2 border-orange-200"
                                                    />
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {program.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-sm text-gray-600">
                                                                {program.trainerName}
                                                            </span>
                                                            {program.rating && (
                                                                <div className="flex items-center gap-1 text-sm bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                                                                    <Star size={14} className="fill-orange-500 text-orange-500" />
                                                                    <span>{program.rating}</span>
                                                                    <span className="text-gray-500">({program.reviews})</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">{program.createdAt}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => toggleFavorite(program.id)}
                                                    >
                                                        <Heart
                                                            size={18}
                                                            className={program.isFavorite ? "fill-orange-500 text-orange-500" : "text-gray-400"}
                                                        />
                                                    </Button>
                                                </div>
                                            </div>

                                            <p className="text-gray-700">{program.description}</p>

                                            <div className="flex flex-wrap gap-2">
                                                {program.tags.map((tag, i) => (
                                                    <Badge key={i} variant="secondary" className="px-3 py-1 rounded-full">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {program.level && (
                                                    <Badge variant={program.level === "Advanced" ? "destructive" : program.level === "Intermediate" ? "default" : "outline"}>
                                                        {program.level}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-4 text-sm text-gray-800">
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign size={16} className="text-green-600" />
                                                        <span className="font-semibold text-green-600">${program.price}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={16} className="text-orange-600" />
                                                        <span>{program.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        Details
                                                    </Button>
                                                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                                        Enroll Now
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                                        <div className="mx-auto max-w-md">
                                            <Search size={48} className="mx-auto text-gray-400 mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
                                            <p className="text-gray-600 mb-4">
                                                Try adjusting your search or filter criteria to find what you're looking for.
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSearch("");
                                                    setFilters({
                                                        duration: "All",
                                                        goal: "All",
                                                        level: "All",
                                                        priceRange: [0, 500]
                                                    });
                                                }}
                                            >
                                                Reset Filters
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}