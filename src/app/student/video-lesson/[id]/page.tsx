"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Play, Home, BookOpen, BarChart, FileText, User, ChevronLeft } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Sample video data - would come from API in real app
const videoData = {
    "1": {
        id: "1",
        title: "Lesson 1: Introduction",
        subject: "Mathematics",
        duration: "15:30",
        description: "Basic concepts and fundamentals overview. This lesson covers the core principles that form the foundation of all mathematical operations.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        relatedVideos: ["5", "6"],
    },
    "2": {
        id: "2",
        title: "Lesson 2: Advanced Topics",
        subject: "Physics",
        duration: "22:45",
        description: "Deep dive into complex theories and applications. Explore advanced concepts with real-world examples and demonstrations.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        relatedVideos: ["4", "5"],
    },
    "3": {
        id: "3",
        title: "Lesson 3: Practical Examples",
        subject: "Chemistry",
        duration: "18:20",
        description: "Real-world applications and case studies. See how chemical principles apply in laboratory and industrial settings.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        relatedVideos: ["2", "6"],
    },
    "4": {
        id: "4",
        title: "Lesson 4: Problem Solving",
        subject: "Biology",
        duration: "25:10",
        description: "Step-by-step problem solving techniques. Learn systematic approaches to biological problems and experiments.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        relatedVideos: ["1", "3"],
    },
    "5": {
        id: "5",
        title: "Lesson 5: Review Session",
        subject: "Mathematics",
        duration: "12:30",
        description: "Comprehensive review and key takeaways. Consolidate your understanding with summary and practice exercises.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        relatedVideos: ["2", "4"],
    },
    "6": {
        id: "6",
        title: "Lesson 6: Assessment Prep",
        subject: "Physics",
        duration: "20:15",
        description: "Preparation strategies for upcoming tests. Learn effective study techniques and time management for exams.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        relatedVideos: ["1", "3"],
    },
};

export default function VideoLessonDetail({ params }: { params: { id: string } }) {
    const [video, setVideo] = useState<typeof videoData[string] | null>(null);
    const [relatedVideos, setRelatedVideos] = useState<typeof videoData[string][]>([]);
    const router = useRouter();

    useEffect(() => {
        if (params.id) {
            const currentVideo = videoData[params.id];
            if (currentVideo) {
                setVideo(currentVideo);

                // Get related videos
                const related = currentVideo.relatedVideos
                    .map(id => videoData[id])
                    .filter(Boolean) as typeof videoData[string][];
                setRelatedVideos(related);
            }
        }
    }, [params.id]);

    if (!video) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Video Not Found</h1>
                    <p className="text-gray-600 mt-2">The requested video could not be found.</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg--100">
                {/* Status Bar */}

                {/* Header */}
                <div className="px-4 py-6 bg- -mt-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-indigo-600"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                       
                    </div>
                </div>

                {/* Video Player Section */}
                <div className="px-4 py-4">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="aspect-video relative">
                            <video
                                className="w-full h-full object-cover"
                                controls
                                autoPlay
                                muted
                                playsInline
                            >
                                <source src={video.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>

                {/* Video Details */}
                <div className="px-4 py-4">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h1 className="text-xl font-bold text-gray-800 mb-2">{video.title}</h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <span className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full mr-3">
                                {video.subject}
                            </span>
                            <span className="text-sm">{video.duration}</span>
                        </div>

                        <p className="text-gray-600 text-sm mb-5">{video.description}</p>

                        <div className="flex space-x-2">
                            <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                Mark as Complete
                            </button>
                            <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                                Download
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Videos */}
                {relatedVideos.length > 0 && (
                    <div className="px-4 py-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Continue Learning</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {relatedVideos.map((related) => (
                                <div
                                    key={related.id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => router.push(`/student/video-lesson/${related.id}`)}
                                >
                                    <div className="aspect-video relative">
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <Play className="w-10 h-10 text-indigo-600" />
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{related.title}</h3>
                                        <p className="text-xs text-gray-500">{related.duration}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
                    <div className="flex justify-around py-3">
                        <button className="flex flex-col items-center">
                            <Home className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-500">Home</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                            <span className="text-xs text-indigo-600">Lessons</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <BarChart className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-500">Reports</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <FileText className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-500">Tasks</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <User className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-500">Profile</span>
                        </button>
                    </div>
                    <div className="h-2 w-20 mx-auto bg-gray-400 rounded-full"></div>
                </div>
            </div>
        </DashboardLayout>
    );
}