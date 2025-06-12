"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Calendar, ClipboardList, TrendingUp,
  User, Clock, Award, AlertCircle, FileText,
  CheckCircle2, XCircle, Calendar as CalendarIcon,
  Bell,
  ChevronRight,
  BookCheck,
  BarChart3
} from "lucide-react";
import Link from "next/link";

type StudentInfo = {
  id: string;
  name: string;
  surname: string;
  studentId: string;
  className: string;
  grade: number;
  attendanceRate: number;
  rollNo?: string;
  profileCompletion: number;
};

type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  maxGrade: number;
};

type Grade = {
  subject: string;
  grade: string;
  percentage: number;
  maxMarks: number;
  obtainedMarks: number;
};

type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
};

type AttendanceRecord = {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject?: string;
};

export default function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchStudentInfo(),
      fetchAssignments(),
      fetchGrades(),
      fetchAnnouncements(),
      fetchAttendanceRecords()
    ]).finally(() => setIsLoading(false));
  }, []);

  const fetchStudentInfo = async () => {
    try {
      const response = await fetch('/api/student/info');
      if (response.ok) {
        const data = await response.json();
        setStudentInfo(data);
      }
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/student/assignments');
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await fetch('/api/student/grades');
      if (response.ok) {
        const data = await response.json();
        setGrades(data);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/student/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch('/api/student/attendance');
      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'graded':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'graded':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  

  
   
  

  return (
    <DashboardLayout>
      <div className="min-h-screen  text-white">
        
        {/* Header */}
       
        {/* Welcome Card */}
       

        {/* Stats Grid */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Attendance Card */}
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Attendance</p>
                    <p className="text-2xl font-bold mt-1">{studentInfo?.attendanceRate || 0}%</p>
                  </div>
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <Progress value={studentInfo?.attendanceRate || 0} className="mt-3 h-1 bg-gray-200" />
              </CardContent>
            </Card>

            {/* Grade Average Card */}
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Grade Avg</p>
                    <p className="text-2xl font-bold mt-1">
                      {grades.length > 0
                        ? Math.round(grades.reduce((acc, g) => acc + g.percentage, 0) / grades.length)
                        : 0}%
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {grades.length} subjects
                </p>
              </CardContent>
            </Card>

            {/* Pending Assignments Card */}
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                    <p className="text-2xl font-bold mt-1">
                      {assignments.filter(a => a.status === 'pending').length}
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  assignments due
                </p>
              </CardContent>
            </Card>

            {/* Profile Completion Card */}
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Profile</p>
                    <p className="text-2xl font-bold mt-1">{studentInfo?.profileCompletion || 75}%</p>
                  </div>
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <Progress value={studentInfo?.profileCompletion || 75} className="mt-2 h-1 bg-gray-200" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2  gap-4">
            <Button variant="outline" className="h-24 flex-col space-y-2 border-0 shadow-sm" asChild>
              <Link href="/student/schedule">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-sm font-medium">Schedule</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2 border-0 shadow-sm" asChild>
              <Link href="/student/lessons">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium">Lessons</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2 border-0 shadow-sm" asChild>
              <Link href="/student/grades">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Reports</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex-col space-y-2 border-0 shadow-sm" asChild>
              <Link href="/student/assignments">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Tasks</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="px-4 pb-24">
          {/* Urgent Items */}
          {(assignments.filter(a => a.status === 'pending' || a.status === 'overdue').length > 0 ||
            announcements.filter(a => a.priority === 'high').length > 0) && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg font-semibold text-gray-800">Needs Attention</h2>
                </div>
                <div className="space-y-3">
                  {assignments
                    .filter(a => a.status === 'overdue')
                    .slice(0, 3)
                    .map((assignment) => (
                      <Card key={assignment.id} className="bg-red-50 border-red-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium text-red-500">Overdue Assignment</span>
                              </div>
                              <h3 className="font-semibold mb-1">{assignment.title}</h3>
                              <p className="text-sm text-gray-600">{assignment.subject}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {announcements
                    .filter(a => a.priority === 'high')
                    .slice(0, 2)
                    .map((announcement) => (
                      <Card key={announcement.id} className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Bell className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-600">Important</span>
                              </div>
                              <h3 className="font-semibold mb-1">{announcement.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {announcement.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

          {/* Recent Assignments */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Assignments</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/student/assignments">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {assignments.slice(0, 4).map((assignment) => (
                <Card key={assignment.id} className="bg-white border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(assignment.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{assignment.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">
                              {assignment.subject}
                            </span>
                            <span className="text-xs text-gray-500">
                              •
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">
                          {assignment.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {assignments.length === 0 && (
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ClipboardList className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No assignments yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Performance Overview</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/student/grades">
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {grades.slice(0, 3).map((grade, index) => (
                <Card key={index} className="bg-white border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <BookCheck className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{grade.subject}</h3>
                          <p className="text-sm text-gray-500">
                            {grade.obtainedMarks}/{grade.maxMarks} marks
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{grade.percentage}%</div>
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">
                          {grade.grade}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={grade.percentage} className="h-2 bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Announcements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Announcements</h2>
            </div>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((announcement) => (
                <Card key={announcement.id} className="bg-white border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${announcement.priority === 'high' ? 'bg-red-100' :
                          announcement.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                        <Bell className={`h-4 w-4 ${announcement.priority === 'high' ? 'text-red-600' :
                            announcement.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{announcement.title}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {announcement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {announcements.length === 0 && (
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No recent announcements</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="flex justify-around py-3">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-xs text-gray-600">Home</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="text-xs text-gray-400">Schedule</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span className="text-xs text-gray-400">Lessons</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-xs text-gray-400">Tasks</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs text-gray-400">More</span>
            </div>
          </div>
          <div className="h-2 w-20 mx-auto bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
