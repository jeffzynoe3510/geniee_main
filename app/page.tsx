"use client";
import React, { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import Link from 'next/link';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface Feature {
  title: string;
  icon: string;
  description: string;
  path: string;
  color: string;
}

interface QuickAction {
  title: string;
  icon: string;
  path: string;
  color: string;
}

function MainComponent() {
  const { data: user, loading, error } = useUser();
  const [activeTab, setActiveTab] = useState("home");

  const mainFeatures: Feature[] = [
    {
      title: "Virtual Try-On",
      icon: "fa-tshirt",
      description: "Try on outfits virtually",
      path: "/virtual-try-on",
      color: "#FF6B6B",
    },
    {
      title: "Skin Analysis",
      icon: "fa-magnifying-glass",
      description: "Get detailed skin insights",
      path: "/skin-analysis",
      color: "#4ECDC4",
    },
    {
      title: "Fitness Coach",
      icon: "fa-dumbbell",
      description: "Personal workout guidance",
      path: "/personal-fitness-coach",
      color: "#45B7D1",
    },
    {
      title: "Virtual Assistant",
      icon: "fa-robot",
      description: "Get help and recommendations",
      path: "/virtual-assistant",
      color: "#96CEB4",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Analyze Fit",
      icon: "fa-ruler",
      path: "/analyze-fit",
      color: "#D4A5A5",
    },
    {
      title: "Profile",
      icon: "fa-user",
      path: "/profile",
      color: "#9B786F",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorMessage message={error.message || "Failed to load user data. Please try again."} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="flex min-h-screen flex-col items-center p-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Welcome{user?.name ? `, ${user.name}` : ''} to Your Wellness Journey
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {mainFeatures.map((feature) => (
              <Link
                key={feature.path}
                href={feature.path}
                className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: feature.color + '20' }}
              >
                <div className="flex items-center mb-4">
                  <i className={`fas ${feature.icon} text-2xl mr-3`} style={{ color: feature.color }} />
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                href={action.path}
                className="p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 flex items-center"
                style={{ backgroundColor: action.color + '20' }}
              >
                <i className={`fas ${action.icon} text-xl mr-3`} style={{ color: action.color }} />
                <span className="font-medium">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}

export default MainComponent; 