'use client';

import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
    X
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUser } from '@/components/Providers/LoggedInUser/LoggedInUserProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    durationInWeeks: z.number().min(1, 'Must be at least 1 week'),
    price: z.number().min(0, 'Price cannot be negative'),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    maxSlot: z.number().min(1, 'Must have at least 1 slot'),
    category: z.string().min(1, 'Category is required'),
});

type ProgramFormData = z.infer<typeof formSchema>;

export default function CreateProgramForm() {
    const { user } = useUser();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProgramFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            durationInWeeks: 0,
            price: 0,
            level: 'Beginner',
            maxSlot: 0,
            category: '',
        },
    });

    const onSubmit = async (data: ProgramFormData) => {
        try {
            console.log(data)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-new-program`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create program');

            toast.success('Program created successfully');
            reset();
            setOpen(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error('Failed to create program');
        }
    };

    return (
        <div className="w-full">
            <Card className="p-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-xl font-semibold">
                        {user.role === "Trainer" ? "My Training Programs" : "My Current Plan"}
                    </h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 py-5 rounded-sm cursor-pointer">
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
                                                Create New Program
                                            </DialogTitle>
                                            <DialogDescription>
                                                Fill in the details to create a new training program
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <ScrollArea className="h-[calc(80vh-180px)] p-6">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="flex items-center gap-2">
                                                <Layers className="h-4 w-4 text-orange-500" />
                                                Program Title
                                            </Label>
                                            <Input
                                                id="title"
                                                {...register('title')}
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
                                                {...register('description')}
                                                placeholder="Detailed description of the program..."
                                                rows={4}
                                                className="focus-visible:ring-1 focus-visible:ring-orange-500 min-h-[120px] rounded-sm"
                                            />
                                            {errors.description && (
                                                <p className="text-sm text-red-500">{errors.description.message}</p>
                                            )}
                                        </div>

                                        {/* Duration & Price */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="durationInWeeks" className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-orange-500" />
                                                    Duration (weeks)
                                                </Label>
                                                <Input
                                                    id="durationInWeeks"
                                                    type="number"
                                                    {...register('durationInWeeks', { valueAsNumber: true })}
                                                    placeholder="e.g., 12"
                                                    className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                                                />
                                                {errors.durationInWeeks && (
                                                    <p className="text-sm text-red-500">{errors.durationInWeeks.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="price" className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-orange-500" />
                                                    Price ($)
                                                </Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    step="0.01"
                                                    {...register('price', { valueAsNumber: true })}
                                                    placeholder="e.g., 199.99"
                                                    className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                                                />
                                                {errors.price && (
                                                    <p className="text-sm text-red-500">{errors.price.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Level & Max Slots */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="level" className="flex items-center gap-2">
                                                    <Award className="h-4 w-4 text-orange-500" />
                                                    Difficulty Level
                                                </Label>
                                                <Select
                                                    {...register('level')}
                                                    defaultValue="Beginner"
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

                                            <div className="space-y-2">
                                                <Label htmlFor="maxSlot" className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-orange-500" />
                                                    Max Participants
                                                </Label>
                                                <Input
                                                    id="maxSlot"
                                                    type="number"
                                                    {...register('maxSlot', { valueAsNumber: true })}
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
                                                {...register('category')}
                                                placeholder="e.g., Fat Loss, Muscle Building"
                                                className="focus-visible:ring-1 focus-visible:ring-orange-500 py-6 rounded-sm"
                                            />
                                            {errors.category && (
                                                <p className="text-sm text-red-500">{errors.category.message}</p>
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
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                Create Program
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
        </div>
    );
}
