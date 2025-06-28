"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApiToast } from "@/components/promise-sonner/promise-sonner";
import { userAtom, User } from "@/lib/atoms/user";

export default function ProfilePage() {
  const [user, setUser] = useAtom(userAtom);
  const [name, setName] = useState("");
  const { callApi, isLoading } = useApiToast();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      callApi({
        url: "/api/user/info",
        method: "GET",
        loadingMessage: "Fetching profile...",
        successMessage: () => "Profile fetched successfully!",
        errorMessage: (err) => `Failed to fetch profile: ${err.message}`,
        onSuccess: (data) => {
          setUser(data.user);
        },
      });
    };

    fetchUserData();
  }, [setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    callApi({
      url: "/api/user/updateInfo",
      method: "PUT",
      data: { name },
      loadingMessage: "Updating profile...",
      successMessage: () => "Profile updated successfully!",
      errorMessage: (err) => `Failed to update profile: ${err.message}`,
      onSuccess: (data) => {
        setUser(data.user);
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-8 py-12 flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
              <AvatarImage
                src={user?.avatar_url || ""}
                alt={user?.name || ""}
              />
              <AvatarFallback className="text-2xl font-semibold bg-blue-100 text-blue-700">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-medium text-gray-900 mb-1">
              {user?.name || "User"}
            </h2>
            <p className="text-gray-600 text-sm">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Display Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={user?.name || "Enter your display name"}
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is how your name will appear to others
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="flex-1"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setName(user?.name || "");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Member since{" "}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
