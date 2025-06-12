"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Home, BookOpen, BarChart, FileText, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

// Define types for our data
type Video = {
    id: string;
    title: string;
    subject: string;
    duration: string;
    description: string;
};

type Subject = {
    id: string;
    name: string;
};

export default function VideoLessons() {
    const [activeSubject, setActiveSubject] = useState("all");
    const router = useRouter();
    const { user, logout } = useAuth();

    // Sample data - would come from API in real app
    const subjects: Subject[] = [
        { id: "all", name: "All" },
        { id: "math", name: "Mathematics" },
        { id: "physics", name: "Physics" },
        { id: "chemistry", name: "Chemistry" },
        { id: "biology", name: "Biology" },
    ];

    const videos: Video[] = [
        {
            id: "1",
            title: "Lesson 1: Introduction",
            subject: "Mathematics",
            duration: "15:30",
            description: "Basic concepts and fundamentals overview",
        },
        {
            id: "2",
            title: "Lesson 2: Advanced Topics",
            subject: "Physics",
            duration: "22:45",
            description: "Deep dive into complex theories and applications",
        },
        {
            id: "3",
            title: "Lesson 3: Practical Examples",
            subject: "Chemistry",
            duration: "18:20",
            description: "Real-world applications and case studies",
        },
        {
            id: "4",
            title: "Lesson 4: Problem Solving",
            subject: "Biology",
            duration: "25:10",
            description: "Step-by-step problem solving techniques",
        },
        {
            id: "5",
            title: "Lesson 5: Review Session",
            subject: "Mathematics",
            duration: "12:30",
            description: "Comprehensive review and key takeaways",
        },
        {
            id: "6",
            title: "Lesson 6: Assessment Prep",
            subject: "Physics",
            duration: "20:15",
            description: "Preparation strategies for upcoming tests",
        },
    ];

    // Filter videos based on selected subject
    const filteredVideos = activeSubject === "all"
        ? videos
        : videos.filter(video => video.subject.toLowerCase() === activeSubject);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100">
                {/* Status Bar */}




                {/* Welcome Card */}
                <div className="px-4 py-6">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.01]">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800">Continue Learning, {user?.username}</h2>
                            <p className="text-gray-600 mt-1 mb-4">
                                Access your video lessons and enhance your understanding of key concepts.
                            </p>
                            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105">
                                All Subjects
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subject Tags */}
                <div className="px-4 py-2">
                    <div className="flex overflow-x-auto gap-2 pb-2">
                        {subjects.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => setActiveSubject(subject.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeSubject === subject.id
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {subject.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Grid */}
                <div className="px-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        {filteredVideos.map((video) => (
                            <div
                                key={video.id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer"
                                onClick={() => router.push(`/student/video-lesson/${video.id}`)}
                            >
                                <div className="p-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300 mb-4 relative">
                                        <Play className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-800 mb-1">{video.title}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{video.duration}</p>
                                    <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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