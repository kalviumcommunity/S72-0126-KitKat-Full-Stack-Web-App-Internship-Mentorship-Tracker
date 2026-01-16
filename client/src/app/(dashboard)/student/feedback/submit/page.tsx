import { FeedbackSubmissionForm } from '@/components/forms/FeedbackSubmissionForm';

export default function FeedbackSubmitPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Submit Feedback
                    </h1>
                    <p className="text-gray-500">
                        Let us know how we can improve your learning experience.
                    </p>
                </div>
            </div>

            <div className="flex justify-center py-8">
                <FeedbackSubmissionForm />
            </div>
        </div>
    );
}
