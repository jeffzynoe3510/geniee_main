"use client";
import React, { useState } from "react";
import useUser from "@/hooks/useUser";
import Link from 'next/link'

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
  const { data: user, loading } = useUser();
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to the Mental Health App</h1>
    </main>
  );
}

export default MainComponent; 