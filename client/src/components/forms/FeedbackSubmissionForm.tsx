'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

// Zod schema for validation
const feedbackSchema = z.object({
    topic: z.string().min(1, 'Please select a topic'),
    priority: z.string().min(1, 'Please select a priority'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
    mentor: z.string().optional(), // Optional for now
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const TOPICS = [
    { value: 'DSA', label: 'DSA' },
    { value: 'System Design', label: 'System Design' },
    { value: 'Resume Review', label: 'Resume Review' },
    { value: 'Mock Interview', label: 'Mock Interview' },
    { value: 'Career Guidance', label: 'Career Guidance' },
    { value: 'Other', label: 'Other' },
];

const PRIORITIES = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
];

export function FeedbackSubmissionForm() {
    const [formData, setFormData] = useState<FeedbackFormData>({
        topic: '',
        priority: '',
        message: '',
        mentor: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FeedbackFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        try {
            feedbackSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof FeedbackFormData, string>> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as keyof FeedbackFormData] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleChange = (field: keyof FeedbackFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user changes field
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log('Feedback submitted:', formData);
            setIsSuccess(true);
            setFormData({ topic: '', priority: '', message: '', mentor: '' });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50">
                <CardContent className="pt-6 pb-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <svg
                                className="h-8 w-8 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-green-900">Feedback Submitted!</h3>
                    <p className="text-green-700 max-w-md mx-auto">
                        Your feedback has been successfully submitted. We appreciate your input and will review it shortly.
                    </p>
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white mt-4"
                        onClick={() => setIsSuccess(false)}
                    >
                        Submit Another Response
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
                <CardDescription>
                    Share your thoughts about your mentorship sessions or platform experience.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Topic"
                            options={TOPICS}
                            placeholder="Select a topic"
                            value={formData.topic}
                            onChange={(e) => handleChange('topic', e.target.value)}
                            error={errors.topic}
                            required
                        />

                        <Select
                            label="Priority"
                            options={PRIORITIES}
                            placeholder="Select priority"
                            value={formData.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                            error={errors.priority}
                            required
                        />
                    </div>

                    <Input
                        label="Mentor Name (Optional)"
                        placeholder="e.g. John Doe"
                        value={formData.mentor}
                        onChange={(e) => handleChange('mentor', e.target.value)}
                        helperText="Leave blank if this is general feedback"
                    />

                    <Textarea
                        label="Your Feedback"
                        placeholder="Please describe your experience or suggestions in detail..."
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        error={errors.message}
                        required
                        rows={5}
                    />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setFormData({ topic: '', priority: '', message: '', mentor: '' })}
                        disabled={isSubmitting}
                    >
                        Reset
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                        Submit Feedback
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
