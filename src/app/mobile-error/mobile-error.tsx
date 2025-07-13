"use client"

import { AlertTriangleIcon } from "lucide-react";

const ErrorPage = ({
    error,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) => {
    return ( 
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <AlertTriangleIcon className="size-10 text-blue-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Something went wrong
                    </h2>
                    <p>
                        {error.message}
                    </p>
                </div>
            </div>
        </div>
     );
}
 
export default ErrorPage;