"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Award, TrendingUp, Target, BookOpen,
  Download, Filter, Calendar
} from "lucide-react";

// TypeScript interfaces
type Grade = {
  subject: string;
  subjectId: string;
  assignments: Array<{
    title: string;
    grade: number;
    maxGrade: number;
    date: string;
    type: 'assignment' | 'quiz' | 'exam';
  }>;
  currentGrade: string;
  percentage: number;
  credits: number;
  teacher: string;
};

type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export default function StudentGrades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('current');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch semesters on initial load
  useEffect(() => {
    fetchSemesters();
  }, []);

  // Fetch grades when semester changes
  useEffect(() => {
    if (selectedSemester) {
      fetchGrades();
    }
  }, [selectedSemester]);

  // Fetch semesters from API
  const fetchSemesters = async () => {
    try {
      const response = await fetch('/api/student/semesters');
      if (response.ok) {
        const data = await response.json();
        setSemesters(data);

        // Set current semester as default
        const currentSemester = data.find((s: Semester) => s.isActive);
        if (currentSemester) {
          setSelectedSemester(currentSemester.id);
        }
      }
    } catch (error) {
      console.error('Error fetching semesters:', error);
      setError('Failed to load semesters');
    }
  };

  // Fetch grades for selected semester
  const fetchGrades = async () => {
    try {
      const response = await fetch(`/api/student/grades?semester=${selectedSemester}`);
      if (response.ok) {
        const data = await response.json();
        setGrades(data);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      setError('Failed to load grades');
    } finally {
      setIsLoading(false);
    }
  };

  // Download transcript as PDF
  const downloadTranscript = async () => {
    try {
      const response = await fetch('/api/student/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semester: selectedSemester,
          format: 'pdf'
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${selectedSemester}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Error downloading transcript:', error);
      alert('Failed to download transcript');
    }
  };

  // Calculate overall statistics
  const overallStats = {
    gpa: grades.length > 0
      ? grades.reduce((sum, grade) => {
          const gradePoints =
            grade.currentGrade === 'A+' ? 10 :
            grade.currentGrade === 'A' ? 9 :
            grade.currentGrade === 'B+' ? 8 :
            grade.currentGrade === 'B' ? 7 :
            grade.currentGrade === 'C+' ? 6 :
            grade.currentGrade === 'C' ? 5 :
            grade.currentGrade === 'D' ? 4 : 0;
          return sum + (gradePoints * grade.credits);
        }, 0) / grades.reduce((sum, grade) => sum + grade.credits, 0)
      : 0,
    totalCredits: grades.reduce((sum, grade) => sum + grade.credits, 0),
    averagePercentage: grades.length > 0
      ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length
      : 0,
    totalAssignments: grades.reduce((sum, grade) => sum + grade.assignments.length, 0)
  };

  // Prepare data for charts
  const subjectChartData = grades.map(grade => ({
    subject: grade.subject.substring(0, 8),
    percentage: grade.percentage,
    credits: grade.credits
  }));

  const gradeDistribution = grades.reduce((acc, grade) => {
    const gradeKey = grade.currentGrade;
    acc[gradeKey] = (acc[gradeKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    name: grade,
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-destructive p-4">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      

      {/* Header */}
      <div className="px-4 py-6 bg-">
        <h1 className="text-2xl font-bold text-orange-500">My Grades</h1>
        <p className="text-sm text-gray-500 mt-1">Track your academic performance and progress</p>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-24 bg-">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white rounded-lg shadow-sm hover:translate-y-[-2px] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">GPA</CardTitle>
              <Award className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.gpa.toFixed(2)}</div>
              <p className="text-xs text-gray-500">
                Out of 10.0
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm hover:translate-y-[-2px] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averagePercentage.toFixed(1)}%</div>
              <p className="text-xs text-gray-500">
                Across all subjects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm hover:translate-y-[-2px] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Credits</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalCredits}</div>
              <p className="text-xs text-gray-500">
                Total credits
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm hover:translate-y-[-2px] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <Target className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalAssignments}</div>
              <p className="text-xs text-gray-500">
                Completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="subjects" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                By Subject
              </TabsTrigger>
              <TabsTrigger value="assignments" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Assignments
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Academic Overview</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Card className="bg-white rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-500">4.2</div>
                      <div className="text-sm text-gray-500">Current GPA</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-500">85%</div>
                      <div className="text-sm text-gray-500">Overall Average</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-500">12</div>
                      <div className="text-sm text-gray-500">Total Subjects</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-500">8</div>
                      <div className="text-sm text-gray-500">Completed</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Semester Progress</p>
                  <Progress value={67} className="h-2 bg-gray-200" />
                  <p className="text-xs text-gray-400 mt-1">67% Complete</p>
                </div>
              </div>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Subjects Performance</h3>
                <div className="space-y-3">
                  {grades.map((grade) => (
                    <Card key={grade.subjectId} className="bg-white rounded-lg shadow-sm hover:translate-x-1 transition-all">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{grade.subject}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                grade.percentage >= 90 ? "default" :
                                grade.percentage >= 75 ? "secondary" :
                                grade.percentage >= 60 ? "outline" : "destructive"
                              }
                            >
                              {grade.currentGrade}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {grade.credits} credits
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Current Grade</span>
                          <span className="font-bold">{grade.percentage}%</span>
                        </div>
                        <Progress value={grade.percentage} className="h-2 mt-1" />
                        <p className="text-sm text-gray-500 mt-1">
                          Teacher: {grade.teacher}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Assignments & Tasks</h3>
                <div className="space-y-3">
                  {grades.flatMap(grade =>
                    grade.assignments.map(assignment => ({
                      ...assignment,
                      subject: grade.subject
                    }))
                  )
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((assignment, index) => (
                    <Card key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-gray-500">
                              {assignment.subject} • {new Date(assignment.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={
                                  assignment.type === 'exam' ? 'bg-red-100 text-red-800' :
                                  assignment.type === 'quiz' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }
                              >
                                {assignment.type}
                              </Badge>
                              <span className="font-bold">
                                {assignment.grade}/{assignment.maxGrade}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {Math.round((assignment.grade / assignment.maxGrade) * 100)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="bg-white rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-500">92%</div>
                      <div className="text-sm text-gray-500">Assignment Rate</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-500">3.8</div>
                      <div className="text-sm text-gray-500">Avg. GPA</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-500">15</div>
                      <div className="text-sm text-gray-500">Study Hours/Week</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-500">87%</div>
                      <div className="text-sm text-gray-500">Attendance</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Grade Distribution</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">A Grades</span>
                        <span className="text-sm font-medium text-green-600">40%</span>
                      </div>
                      <Progress value={40} className="h-1 bg-gray-200" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">B Grades</span>
                        <span className="text-sm font-medium text-yellow-600">35%</span>
                      </div>
                      <Progress value={35} className="h-1 bg-gray-200" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">C Grades</span>
                        <span className="text-sm font-medium text-red-600">25%</span>
                      </div>
                      <Progress value={25} className="h-1 bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      
    </DashboardLayout>
  );
}