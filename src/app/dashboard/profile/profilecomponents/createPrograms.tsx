'use client';

import { useState } from 'react';
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
    Tag
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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type ProgramFormData = {
    title: string;
    description: string;
    durationInWeeks: number;
    price: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    maxSlot: number;
    category: string;
};

const defaultForm: ProgramFormData = {
    title: '',
    description: '',
    durationInWeeks: 0,
    price: 0,
    level: 'Beginner',
    maxSlot: 0,
    category: '',
};

export default function CreateProgramForm() {
    const [form, setForm] = useState<ProgramFormData>(defaultForm);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'durationInWeeks' || name === 'maxSlot' ? Number(value) : value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/programs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to create program');

            toast.success('Program created successfully');
            setForm(defaultForm);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error('Failed to create program');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Card className="w-full">
                <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-orange-500" />
                        <div>
                            <CardTitle className="text-2xl text-gray-800 dark:text-white">
                                Create New Program
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                Fill in the details to create a new training program
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-orange-500" />
                                Program Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 12-Week Fat Loss Program"
                                className="focus-visible:ring-orange-500"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-orange-500" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Detailed description of the program..."
                                rows={4}
                                className="focus-visible:ring-orange-500"
                            />
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
                                    name="durationInWeeks"
                                    type="number"
                                    min="1"
                                    value={form.durationInWeeks}
                                    onChange={handleChange}
                                    placeholder="e.g., 12"
                                    className="focus-visible:ring-orange-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price" className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-orange-500" />
                                    Price ($)
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="e.g., 199.99"
                                    className="focus-visible:ring-orange-500"
                                />
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
                                    value={form.level}
                                    onValueChange={(value) => handleSelectChange('level', value)}
                                >
                                    <SelectTrigger className="w-full focus:ring-orange-500">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxSlot" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-orange-500" />
                                    Max Participants
                                </Label>
                                <Input
                                    id="maxSlot"
                                    name="maxSlot"
                                    type="number"
                                    min="1"
                                    value={form.maxSlot}
                                    onChange={handleChange}
                                    placeholder="e.g., 20"
                                    className="focus-visible:ring-orange-500"
                                />
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
                                name="category"
                                type="text"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="e.g., Fat Loss, Muscle Building"
                                className="focus-visible:ring-orange-500"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Creating Program...
                                </>
                            ) : (
                                <>
                                    Create Program
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}