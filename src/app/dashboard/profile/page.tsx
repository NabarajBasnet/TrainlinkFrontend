'use client';

import { User, Star, Award, Calendar, Clock, Bookmark, Settings, Briefcase, Heart, Trophy, Shield, BookOpen, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/components/Providers/LoggedInUser/LoggedInUserProvider";
import Link from "next/link";

const ProfileCSR = () => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center p-4">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full flex items-center justify-center p-4">
                <Card className="w-full max-w-4xl text-center p-8">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No user found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Please sign in to view your profile
                    </p>
                    <Link href="/login" className="mt-6 inline-block">
                        <Button>Sign In</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const profileCompletion = user.role === "Trainer"
        ? Math.round((user.trainerProfile?.setupStage / 6) * 100)
        : Math.round((user.memberProfile?.goals?.length > 0 ? 1 : 0) * 100);

    return (
        <div className="w-full flex items-center justify-center p-4">
            <div className="w-full space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                    {user.fullName?.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                    <span className="capitalize">{user.role.toLowerCase()}</span>
                                    {user.role === "Trainer" && user.trainerProfile?.ratings && (
                                        <span className="flex items-center ml-4">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                            {user.trainerProfile.ratings.toFixed(1)}
                                        </span>
                                    )}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Button variant="outline" className="flex items-center">
                                <Bookmark className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                            <Button variant="outline" className="flex items-center">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Completion */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Profile Strength</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Progress value={profileCompletion} className="h-2" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {profileCompletion}% complete
                                </p>
                                {profileCompletion < 100 && (
                                    <Button variant="link" onClick={() => window.location.href = window.location.pathname} size="sm" className="cursor-pointer mt-2 p-0 h-auto">
                                        Complete your profile
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Member since</p>
                                        <p className="text-sm font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {user.role === "Trainer" && (
                                    <>
                                        <div className="flex items-center space-x-3">
                                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Completed programs</p>
                                                <p className="text-sm font-medium">12</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Heart className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Clients</p>
                                                <p className="text-sm font-medium">24</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {user.role === "Member" && (
                                    <div className="flex items-center space-x-3">
                                        <Trophy className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Programs completed</p>
                                            <p className="text-sm font-medium">5</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Skills/Goals Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {user.role === "Trainer" ? "Expertise" : "Fitness Goals"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.role === "Trainer" ? (
                                    user.trainerProfile?.experties?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {user.trainerProfile.experties.map((skill, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No expertise added yet
                                        </p>
                                    )
                                ) : (
                                    user.memberProfile?.goals?.length > 0 ? (
                                        <div className="space-y-2">
                                            {user.memberProfile.goals.map((goal, i) => (
                                                <div key={i} className="flex items-center">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                    <span className="text-sm">{goal}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No goals set yet
                                        </p>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
                                <TabsTrigger value="overview" className='cursor-pointer'>Overview</TabsTrigger>
                                <TabsTrigger value="programs" className='cursor-pointer'>
                                    {user.role === "Trainer" ? "My Programs" : "My Plan"}
                                </TabsTrigger>
                                <TabsTrigger value="reviews" className='cursor-pointer'>Reviews</TabsTrigger>
                                {user.role === "Trainer" && (
                                    <TabsTrigger value="certifications" className='cursor-pointer'>Certifications</TabsTrigger>
                                )}
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {user.role === "Trainer" ? "About Me" : "My Fitness Journey"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {user.role === "Trainer" ? (
                                            <div className="prose max-w-none">
                                                <p>
                                                    Certified personal trainer with 5+ years of experience helping clients
                                                    achieve their fitness goals. Specialized in strength training,
                                                    weight loss, and functional fitness.
                                                </p>
                                                <p className="mt-4">
                                                    My approach focuses on sustainable habits and personalized programs
                                                    tailored to each client's needs and lifestyle.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="prose max-w-none">
                                                <p>
                                                    On a journey to improve my overall health and fitness.
                                                    Currently focusing on building strength and endurance.
                                                </p>
                                                <p className="mt-4">
                                                    My favorite activities include weight training and hiking.
                                                    Looking for a trainer who can help me stay consistent and motivated.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {user.role === "Trainer" && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Certifications</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {user.trainerProfile?.certifications?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {user.trainerProfile.certifications.map((cert, i) => (
                                                        <div key={i} className="flex items-start space-x-4">
                                                            <Shield className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <h4 className="font-medium">{cert.name}</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {cert.issuer} • {cert.year}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    No certifications added yet
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* Programs/Plan Tab */}
                            <TabsContent value="programs">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {user.role === "Trainer" ? "My Training Programs" : "My Current Plan"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {user.role === "Trainer" ? (
                                            <div className="space-y-4">
                                                <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium">Fat Burn Bootcamp</h3>
                                                        <Badge variant="outline">Active</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        6-week intensive program for weight loss
                                                    </p>
                                                    <div className="flex items-center mt-3 space-x-4 text-sm">
                                                        <span className="flex items-center">
                                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                                            4.8 (24 reviews)
                                                        </span>
                                                        <span>12 clients enrolled</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium">Strength Training Fundamentals</h3>
                                                        <Badge variant="outline">Week 3 of 8</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        With trainer Alex Johnson
                                                    </p>
                                                    <div className="flex items-center mt-3 space-x-4 text-sm">
                                                        <span>Next session: Tomorrow at 6 PM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Reviews Tab */}
                            <TabsContent value="reviews">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Reviews</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="border-b pb-6 last:border-0 last:pb-0">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src="https://i.pravatar.cc/100?img=3" />
                                                        <AvatarFallback>JD</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-medium">John Doe</h4>
                                                        <div className="flex items-center mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="mt-3 text-sm">
                                                    {user.role === "Trainer"
                                                        ? "Alex is an amazing trainer! His bootcamp program helped me lose 15 pounds in just 6 weeks."
                                                        : "The strength training program has been exactly what I needed. Seeing great progress!"}
                                                </p>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    2 weeks ago
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Certifications Tab (Trainer only) */}
                            {user.role === "Trainer" && (
                                <TabsContent value="certifications">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Certifications</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {user.trainerProfile?.certifications?.length > 0 ? (
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    {user.trainerProfile.certifications.map((cert, i) => (
                                                        <Card key={i} className="hover:shadow-md transition-shadow">
                                                            <CardHeader className="pb-3">
                                                                <div className="flex items-center space-x-3">
                                                                    <Award className="h-6 w-6 text-primary" />
                                                                    <div>
                                                                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                                                                        <CardDescription>{cert.issuer}</CardDescription>
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div className="flex justify-between text-sm">
                                                                    <span>Issued: {cert.year}</span>
                                                                    <span>ID: {cert.id || 'N/A'}</span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                                                    <h3 className="mt-4 text-lg font-medium">No certifications yet</h3>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        Add your certifications to build trust with potential clients
                                                    </p>
                                                    <Button variant="outline" className="mt-6">
                                                        Add Certification
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCSR;
