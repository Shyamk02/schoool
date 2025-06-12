"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  User, Mail, Phone, MapPin, Calendar,
  Upload, Save, Edit3, Camera, School,
  Users, FileText, Shield
} from "lucide-react";

type StudentProfile = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyContactName: string;
  parentDetails: {
    fatherName: string;
    motherName: string;
    guardianPhone: string;
    occupation: string;
  };
  academicInfo: {
    rollNo: string;
    className: string;
    section: string;
    admissionDate: string;
    studentId: string;
  };
  profileImage: string;
  documents: Array<{
    type: string;
    name: string;
    url: string;
    uploadDate: string;
  }>;
  profileCompletion: number;
};

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
 const [activeTab, setActiveTab] = useState("personal");
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/student/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsEditing(false);
        fetchProfile(); // Refresh profile data
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/student/profile/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => prev ? { ...prev, profileImage: data.imageUrl } : null);
        toast({
          title: "Success",
          description: "Profile image updated successfully",
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p>Profile not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      

      {/* Header */}
      <div className="px-4 py-6 bg-white">
        {/* <h1 className="text-2xl font-bold text-orange-500">Student Profile</h1> */}
      </div>

      {/* Profile Card */}
      <div className="px-4 pb-24 bg-white">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative mx-auto w-24 h-24">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.profileImage} />
              <AvatarFallback className="text-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                {profile.name.charAt(0)}{profile.surname.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute bottom-0 right-0">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </div>
          
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold">{profile.name} {profile.surname}</h2>
            <p className="text-gray-500 mt-1">Student ID: {profile.academicInfo.studentId}</p>
            
            <div className="mt-4">
              <Badge variant="outline" className="mb-2">
                {profile.academicInfo.className} - {profile.academicInfo.section}
              </Badge>
              <p className="text-sm text-gray-500">
                Roll No: {profile.academicInfo.rollNo}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span>{profile.profileCompletion}%</span>
              </div>
              <Progress value={profile.profileCompletion} className="h-2 mt-1 bg-gray-200" />
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span>{profile.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{profile.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>
                  {profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString()
                    : 'Not provided'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mt-6">
          <div className="flex w-full border-b border-gray-200">
            <button 
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'personal' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('personal')}
            >
              Personal
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'academic' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('academic')}
            >
              Academic
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'family' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('family')}
            >
              Family
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'documents' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {/* Personal Info Form */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* ... (keep all form fields unchanged) */}
                </div>
              </div>
            )}

            {/* Academic Info */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                {/* ... (keep academic info unchanged) */}
              </div>
            )}

            {/* Family Info */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                {/* ... (keep family info unchanged) */}
              </div>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* ... (keep documents section unchanged) */}
              </div>
            )}
          </div>
        </div>

        {/* Edit Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
          <div className="flex justify-between">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="flex-1 bg-orange-500 text-white"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2 w-full">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex-1 bg-orange-500 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
