'use client';

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
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from 'react';
import {
    User, Star, Award, Calendar, Clock, Bookmark, Settings,
    Briefcase, Heart, Trophy, Shield, BookOpen, CheckCircle,
    Edit, X, Plus, Upload, Image as ImageIcon
} from 'lucide-react';
import { FaExclamation } from "react-icons/fa";
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent,
    CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/components/Providers/LoggedInUser/LoggedInUserProvider";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { useFieldArray, useForm } from 'react-hook-form';

// Types
type Certification = {
    name: string;
    issuer: string;
    year: string;
    id?: string;
};

type CertificationsFormValues = {
    certifications: Certification[];
};

const ProfilePage = () => {
    const { user, loading, refetch, setRefetch } = useUser();

    // State for editing
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [processing, setProcessing] = useState<boolean | null>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Initialize react-hook-form for certifications
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<CertificationsFormValues>({
        defaultValues: {
            certifications: [{ name: '', issuer: '', year: '', id: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "certifications"
    });

    // Watch userBio
    let userBio = watch('userBio');

    // Populate user bio in field and certifications if user is a trainer
    useEffect(() => {
        if (user) {
            setValue('userBio', user?.trainerProfile?.bio || '');

            // If user is a trainer and has certifications, set them in the form
            if (user.role === "Trainer" && user.trainerProfile?.certifications?.length > 0) {
                reset({
                    certifications: user.trainerProfile.certifications
                });
            }
        }
    }, [user, setValue, reset]);

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Open edit dialog for a field
    const openEditDialog = (field: string, currentValue: any) => {
        setEditingField(field);
        setTempValue(currentValue);
        if (field === 'avatar') {
            setImagePreview(user?.avatar || null);
        }
    };

    // Close edit dialog
    const closeEditDialog = () => {
        setEditingField(null);
        setTempValue(null);
        setSelectedImage(null);
        setImagePreview(null);
    };

    // Save changes to user profile
    const saveChanges = async () => {
        if (!editingField || !user) return;

        try {
            let updatedValue = tempValue;

            // Handle image upload
            if (editingField === 'avatar' && selectedImage) {
                // In a real app, you would upload the image here
                // For demo, we'll use the local preview
                updatedValue = imagePreview;
            }

            // Prepare updated user data
            const updatedUser = {
                ...user,
                bio: editingField === 'bio' ? updatedValue : user.bio,
                avatarUrl: editingField === 'avatarUrl' ? updatedValue : user.avatarUrl,
                trainerProfile: {
                    ...user.trainerProfile,
                    experties: editingField === 'experties' ? updatedValue : user.trainerProfile?.experties,
                    certifications: editingField === 'certifications' ? updatedValue : user.trainerProfile?.certifications,
                },
                memberProfile: {
                    ...user.memberProfile,
                    goals: editingField === 'goals' ? updatedValue : user.memberProfile?.goals,
                }
            };

            // Call update function
            // await updateUser(updatedUser);

            toast.success('Your changes have been saved successfully.');
            closeEditDialog();
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
        }
    };

    // Calculate profile completion percentage
    const profileCompletion =
        user?.role === "Trainer"
            ? Math.round(((user?.trainerProfile?.setupStage || 0) / 6) * 100)
            : Math.round(((user?.memberProfile?.setupStage || 0) / 6) * 100);

    // Loading state
    if (loading) {
        return (
            <div className="w-full flex items-center justify-center p-4">
                <Card className="w-full w-full">
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

    // No user state
    if (!user) {
        return (
            <div className="w-full flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center p-8">
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

    // Uplaod profile image
    const uploadProfileImage = async () => {
        if (!selectedImage) {
            toast.error("No image selected");
            return;
        }

        try {
            setProcessing(true);
            const formData = new FormData();
            formData.append("image", selectedImage); // must match `upload.single("image")`

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-avatar`, {
                method: "PATCH",
                body: formData,
            });

            const resBody = await response.json();

            if (response.ok) {
                setProcessing(false);
                setRefetch(!refetch)
                toast.success("Image uploaded successfully");
                setEditingField(null);
            } else {
                setRefetch(!refetch)
                toast.error(resBody.message || "Upload failed");
            }
        } catch (error: any) {
            setRefetch(!refetch)
            console.error("Error: ", error);
            toast.error(error.message);
        }
    };

    // Add Trainer Experties
    const addTrainerExperties = async () => {
        try {
            setProcessing(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-trainer-experties`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tempValue)
            })
            const resBody = await response.json();
            if (response.ok) {
                setProcessing(false);
                toast.success(resBody.message);
                setRefetch(!refetch)
                setEditingField(null);
            }
        } catch (error: any) {
            console.log("Error: ", error);
            toast.error(error.message);
            setRefetch(!refetch)
        };
    };

    // Add or update bio
    const addOrUpdateBio = async () => {
        try {
            setProcessing(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-user-bio`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userBio })
            });
            const resBody = await response.json();
            if (response.ok) {
                setProcessing(false);
                setEditingField(null);
                toast.success(resBody.message);
                setRefetch(!refetch)
                setValue('userBio', user?.trainerProfile?.bio || '');
            } else {
                setRefetch(!refetch)
                toast.error(resBody.message);
            }
        } catch (error: any) {
            setRefetch(!refetch)
            console.log("Error: ", error)
            toast.error(error.message)
        }
    }

    // Certification submittion
    const onSubmit = async (data: CertificationsFormValues) => {
        try {
            setProcessing(true);
            // Transform data to match backend schema
            const transformedCertifications = data.certifications.map(cert => ({
                name: cert.name,
                issuingOrganization: cert.issuer,
                yearObtained: cert.year ? parseInt(cert.year) : undefined,
                certificationId: cert.id || '',
                isVerified: false,
                url: '-'
            }));

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-user-certifications`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    certifications: transformedCertifications
                })
            });

            const resBody = await response.json();

            if (response.ok) {
                setProcessing(false);
                toast.success(resBody.message);
                closeEditDialog();
                setRefetch(!refetch)
            } else {
                toast.error(resBody.message);
                setRefetch(!refetch)
                throw new Error(resBody.message || 'Failed to update certifications');
            }
        } catch (error: any) {
            setRefetch(!refetch);
            console.error("Error updating certifications:", error);
            toast.error(error.message || 'Failed to update certifications');
        }
    };

    // Edit fitness goals
    const editFitnessGoal = async () => {
        try {
            setProcessing(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/edit-fitness-goal`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tempValue)
            });

            const resBody = await response.json();

            if (response.ok) {
                setProcessing(false);
                toast.success(resBody.message);
                closeEditDialog();
                setRefetch(!refetch)
            } else {
                toast.error(resBody.message);
                setRefetch(!refetch)
                throw new Error(resBody.message);
            }
        } catch (error: any) {
            setRefetch(!refetch);
            toast.error(error.message);
        }
    };

    // Remove Single fitness goal
    const removeFitnessGoal = async (goal: string) => {
        try {
            setProcessing(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/remove-fitness-goal`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ goal })
            });

            const resBody = await response.json();

            if (response.ok) {
                setProcessing(false);
                toast.success(resBody.message);
                closeEditDialog();
                setRefetch(!refetch)
            } else {
                toast.error(resBody.message);
                setRefetch(!refetch)
                throw new Error(resBody.message);
            }
        } catch (error: any) {
            setRefetch(!refetch);
            toast.error(error.message);
        }
    };

    // Share Fitness Level
    const shareFitnessLevel = async () => {
        try {
            setProcessing(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/share-fitness-level`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tempValue)
            });

            const resBody = await response.json();

            if (response.ok) {
                setProcessing(false);
                toast.success(resBody.message);
                closeEditDialog();
                setRefetch(!refetch)
            } else {
                toast.error(resBody.message);
                setRefetch(!refetch)
                throw new Error(resBody.message);
            }
        } catch (error: any) {
            setRefetch(!refetch);
            toast.error(error.message);
        }
    };
    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="mx-auto p-4">
                {/* Profile Header */}
                <Card className="mb-4">
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center space-x-4 relative">
                            <div className="relative group">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={imagePreview || user.avatarUrl} />
                                    <AvatarFallback>
                                        {user.fullName?.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => openEditDialog('avatar', user.avatar)}
                                    className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 hover:bg-primary/90 transition-colors shadow-md"
                                    aria-label="Edit profile picture"
                                >
                                    <Edit className="h-4 w-4 cursor-pointer text-white" />
                                </button>
                            </div>
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
                            <Button variant="outline" className="cursor-pointer flex items-center">
                                <Bookmark className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center cursor-pointer"
                                onClick={() => window.location.href = '/dashboard/profile'}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Profile Completion */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-orange-500">Profile Strength</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Progress value={profileCompletion} className="h-2" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {profileCompletion}% complete
                                </p>
                                {profileCompletion < 100 && (
                                    <Button
                                        variant="link"
                                        onClick={() => window.location.href = '/dashboard/profile'}
                                        size="sm"
                                        className="cursor-pointer mt-2 p-0 h-auto"
                                    >
                                        Complete your profile
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-orange-500">Details</CardTitle>
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
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-bold text-orange-500">
                                        {user.role === "Trainer" ? "Expertise" : "Fitness Goals"}
                                    </CardTitle>
                                    <button
                                        onClick={() => openEditDialog(
                                            user.role === "Trainer" ? "experties" : "goals",
                                            user.role === "Trainer"
                                                ? user.trainerProfile?.experties || []
                                                : user.memberProfile?.goals || []
                                        )}
                                        className="text-primary hover:text-primary/80"
                                        aria-label={`Edit ${user.role === "Trainer" ? "expertise" : "goals"}`}
                                    >
                                        <Edit className="h-4 w-4 cursor-pointer" />
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {user?.role === "Trainer" ? (
                                    user?.trainerProfile?.experties?.length > 0 ? (
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
                                                <div key={i} className="flex space-x-4 items-center">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                    <span className="text-sm">{goal}</span>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <RxCross2 className="text-red-600 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 hover:rounded-full h-5 w-5 p-0.5 transition" />
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent className="bg-white dark:bg-zinc-900 border border-red-500 shadow-xl rounded-xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-red-600 dark:text-red-400 text-lg font-semibold flex items-center">
                                                                    <FaExclamation className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
                                                                    Confirm Deletion
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription className="text-zinc-700 dark:text-zinc-300 mt-2">
                                                                    Are you sure you want to remove this goal? This action <span className="font-semibold text-red-600 dark:text-red-400">cannot be undone</span>.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter className="flex justify-end gap-3 mt-4">
                                                                <AlertDialogCancel className="bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded px-4 py-1.5">
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-1.5 shadow"
                                                                    onClick={() => removeFitnessGoal(goal)}
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
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
                            <TabsList className="grid w-full grid-cols-3 mb-2 lg:grid-cols-4">
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
                            <TabsContent value="overview" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg font-bold text-orange-500">
                                                {user.role === "Trainer" ? "About Me" : "My Fitness Journey"}
                                            </CardTitle>
                                            <button
                                                onClick={() =>
                                                    openEditDialog(
                                                        'bio',
                                                        user.role === 'Trainer'
                                                            ? user.trainerProfile?.bio || ''
                                                            : user.memberProfile?.fitnessJourney || ''
                                                    )
                                                }
                                                className="text-primary hover:text-primary/80"
                                                aria-label="Edit bio"
                                            >
                                                <Edit className="h-4 w-4 cursor-pointer" />
                                            </button>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        {user.role === 'Trainer' ? (
                                            user?.trainerProfile?.bio ? (
                                                <div className="prose max-w-none">
                                                    <p className="text-sm font-medium">{user.trainerProfile.bio}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    No bio added yet. Tell clients about your training approach.
                                                </p>
                                            )
                                        ) : user?.memberProfile?.fitnessJourney ? (
                                            <div className="prose max-w-none">
                                                <p className="text-sm font-medium">{user.memberProfile.fitnessJourney}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No bio added yet. Share your fitness journey.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {user.role === "Trainer" && (
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className='text-lg font-bold text-orange-500'>Certifications</CardTitle>
                                                <button
                                                    onClick={() => openEditDialog(
                                                        'certifications',
                                                        user.trainerProfile?.certifications || []
                                                    )}
                                                    className="text-primary cursor-pointer hover:text-primary/80"
                                                    aria-label="Edit certifications"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </div>
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

                                {/* Fitness level (Member only) */}
                                {user.role === "Member" && (
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className='text-lg font-bold text-orange-500'>Fitness Level</CardTitle>
                                                <button
                                                    onClick={() => openEditDialog(
                                                        'fitnessLevel',
                                                        user?.memberProfile?.fitnessLevel || []
                                                    )}
                                                    className="text-primary cursor-pointer hover:text-primary/80"
                                                    aria-label="Edit fitness level"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </div>
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
                                                    No fitness level added yet
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
                            {user?.role === "Trainer" && (
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
                                                                        <CardDescription>{cert.issuingOrganization}</CardDescription>
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div className="flex justify-between text-sm">
                                                                    <span>Issued: {cert.yearObtained}</span>
                                                                    <span>ID: {cert.certificationId || 'N/A'}</span>
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
                                                    <Button
                                                        variant="outline"
                                                        className="mt-6"
                                                        onClick={() => openEditDialog('certifications', [])}
                                                    >
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

                {/* Edit Dialogs */}
                {/* Avatar Dialog */}
                <Dialog open={editingField === 'avatar'} onOpenChange={closeEditDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Profile Picture</DialogTitle>
                            <DialogDescription>
                                Upload a new profile picture to make your profile stand out.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-32 w-32">
                                        <AvatarImage src={imagePreview || user.avatarUrl} />
                                        <AvatarFallback>
                                            {user.fullName?.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {imagePreview && (
                                        <button
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setImagePreview(null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 hover:bg-destructive/90 transition-colors"
                                            aria-label="Remove image"
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label
                                        htmlFor="avatar-upload"
                                        className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {selectedImage ? 'Change Image' : 'Upload Image'}
                                    </Label>
                                    <Input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                className='cursor-pointer'
                                variant="outline" onClick={closeEditDialog}>
                                Cancel
                            </Button>
                            <Button
                                className='cursor-pointer'
                                onClick={uploadProfileImage}
                                disabled={!selectedImage && !imagePreview}
                            >
                                {processing ? 'Uploading...' : 'Upload Image'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Bio Dialog */}
                <Dialog open={editingField === 'bio'} onOpenChange={closeEditDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {user.role === "Trainer" ? "Edit About Me" : "Edit Fitness Journey"}
                            </DialogTitle>
                            <DialogDescription>
                                {user.role === "Trainer"
                                    ? "Tell clients about your training approach and experience."
                                    : "Share your fitness goals and journey."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="bio">
                                    {user.role === "Trainer" ? "About Me" : "My Fitness Journey"}
                                </Label>
                                <Textarea
                                    id="bio"
                                    {...register('userBio')}
                                    rows={6}
                                    placeholder={
                                        user.role === "Trainer"
                                            ? "Certified personal trainer with 5+ years of experience..."
                                            : "On a journey to improve my overall health and fitness..."
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeEditDialog}>
                                Cancel
                            </Button>
                            <Button onClick={addOrUpdateBio} className='cursor-pointer'>{processing ? 'Saving...' : 'Save Changes'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Expertise/Goals Dialog */}
                <Dialog open={editingField === 'experties' || editingField === 'goals'} onOpenChange={closeEditDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Edit {user.role === "Trainer" ? "Expertise" : "Fitness Goals"}
                            </DialogTitle>
                            <DialogDescription>
                                {user.role === "Trainer"
                                    ? "Add your areas of expertise to attract the right clients."
                                    : "Set your fitness goals to help trainers understand your needs."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>
                                    {user.role === "Trainer" ? "Expertise" : "Goals"} (one per line)
                                </Label>
                                <Input
                                    onChange={(e) => setTempValue(
                                        e.target.value.split('\n').filter(item => item.trim())
                                    )}
                                    placeholder={
                                        user.role === "Trainer"
                                            ? "Weight Loss"
                                            : "Lose 10kg"
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                className='cursor-pointer'
                                variant="outline" onClick={closeEditDialog}>
                                Cancel
                            </Button>
                            {user?.role === 'Trainer'
                                ? <Button onClick={() => addTrainerExperties()} className='cursor-pointer'>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button> : <Button onClick={() => editFitnessGoal()} className='cursor-pointer'>
                                    {processing ? 'Saving...' : 'Save Goals'}
                                </Button>}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Fitness Level Dialog */}
                <Dialog open={editingField === 'fitnessLevel' || editingField === 'fitnessLevel'} onOpenChange={closeEditDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Edit {user.role === "Trainer" ? "Expertise" : "Fitness Goals"}
                            </DialogTitle>
                            <DialogDescription>
                                Set your fitness level to help trainers understand your needs.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>
                                    Fitness level (one per line)
                                </Label>
                                <Input
                                    onChange={(e) => setTempValue(
                                        e.target.value.split('\n').filter(item => item.trim())
                                    )}
                                    placeholder={"Expert"}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                className='cursor-pointer'
                                variant="outline" onClick={closeEditDialog}>
                                Cancel
                            </Button>
                            <Button onClick={() => shareFitnessLevel()} className='cursor-pointer'>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Certifications Dialog */}
                <Dialog open={editingField === 'certifications'} onOpenChange={closeEditDialog}>
                    <DialogContent className="max-w-2xl flex flex-col max-h-[90vh]">
                        <DialogHeader className="flex-shrink-0">
                            <DialogTitle>Edit Certifications</DialogTitle>
                            <DialogDescription>
                                Add your professional certifications to build trust with potential clients.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                            {/* Scrollable content area */}
                            <div className="flex-1 overflow-y-auto py-4 px-6">
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="border rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium">Certification #{index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-destructive hover:text-destructive/80"
                                                    aria-label="Remove certification"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`cert-name-${index}`}>Certification Name*</Label>
                                                    <Input
                                                        id={`cert-name-${index}`}
                                                        defaultValue={field.name} // Pre-fill existing data
                                                        {...register(`certifications.${index}.name`, { required: true })}
                                                    />
                                                    {errors.certifications?.[index]?.name && (
                                                        <p className="text-sm text-destructive">This field is required</p>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`cert-issuer-${index}`}>Issuing Organization*</Label>
                                                    <Input
                                                        id={`cert-issuer-${index}`}
                                                        defaultValue={field.issuingOrganization}
                                                        {...register(`certifications.${index}.issuer`, { required: true })}
                                                    />
                                                    {errors.certifications?.[index]?.issuer && (
                                                        <p className="text-sm text-destructive">This field is required</p>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`cert-year-${index}`}>Year Obtained*</Label>
                                                    <Input
                                                        id={`cert-year-${index}`}
                                                        type="number"
                                                        defaultValue={field.yearObtained}
                                                        {...register(`certifications.${index}.year`, {
                                                            required: true,
                                                            validate: (value) => {
                                                                const year = parseInt(value);
                                                                return !isNaN(year) && year > 1900 && year <= new Date().getFullYear();
                                                            }
                                                        })}
                                                    />
                                                    {errors.certifications?.[index]?.year && (
                                                        <p className="text-sm text-destructive">
                                                            {errors.certifications[index]?.year.type === 'validate'
                                                                ? 'Please enter a valid year'
                                                                : 'This field is required'}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor={`cert-id-${index}`}>Certification ID (optional)</Label>
                                                    <Input
                                                        id={`cert-id-${index}`}
                                                        defaultValue={field.certificationId}
                                                        {...register(`certifications.${index}.id`)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fixed footer */}
                            <DialogFooter className="flex-shrink-0 bg-background pt-4 border-t">
                                <div className="flex justify-between w-full">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => append({
                                            name: '',
                                            issuer: '',
                                            year: '',
                                            id: '',
                                            issuingOrganization: '',
                                            yearObtained: undefined,
                                            certificationId: '',
                                            isVerified: false,
                                            url: '-'
                                        })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Certification
                                    </Button>
                                </div>
                                <div className="flex gap-2 w-full mt-4">
                                    <Button type="button" variant="outline" className="flex-1" onClick={closeEditDialog}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
};

export default ProfilePage;
