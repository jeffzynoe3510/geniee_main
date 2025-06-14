"use client";
import React, { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { useLoading } from "@/context/LoadingContext";
import { UserProfile } from "@/types/user";
import LoadingSpinner from "@/components/LoadingSpinner";
import SignOutButton from '@/components/auth/SignOutButton';

function MainComponent() {
  const { data: user, loading: userLoading, error } = useUser();
  const { startLoading, stopLoading } = useLoading();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      // Convert user to UserProfile type
      setProfileData({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }, [user]);

  const handleSave = async (updatedData: UserProfile) => {
    startLoading();
    try {
      const response = await fetch("/api/user-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfileData(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      stopLoading();
    }
  };

  if (userLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Loading profile...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1 text-lg text-gray-900">{profileData.name}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 text-lg text-gray-900">{profileData.email}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <div className="mt-1 text-lg text-gray-900">
                {profileData.createdAt.toLocaleDateString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <div className="mt-1 text-lg text-gray-900">
                {profileData.updatedAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;