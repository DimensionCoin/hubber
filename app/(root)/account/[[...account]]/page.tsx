"use client";

import  React, {useRef} from "react";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { getUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Save,
  Camera,
  LogOut,
  Lock,
  Trash2,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { EmailAddressResource } from "@clerk/types";
import PricingTiers from "@/components/shared/Pricingcards";

export default function Account() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
const [showOtpModal, setShowOtpModal] = useState(false);
const [emailCode, setEmailCode] = useState(["", "", "", "", "", ""]);
const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [emailObj, setEmailObj] = useState<EmailAddressResource | null>(null);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");


  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subscriptionTier: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData(user.id);
    }
  }, [isLoaded, user]);

  async function fetchUserData(userId: string) {
    try {
      const data = await getUser(userId);
      if (data) {
        setUserData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || user?.primaryEmailAddress || "",
          subscriptionTier: data.subscriptionTier || "free",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function updateUserProfile() {
    if (!user) {
      toast.error("User not found. Please log in.");
      return;
    }

    setIsSaving(true);
    try {
      await user.update({
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          subscriptionTier: userData.subscriptionTier,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function changePassword() {
    if (!user) {
      toast.error("User not found. Please log in.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          newPassword: newPassword,
        }),
      });

      const responseData = await response.json(); // ✅ Parse response

      if (!response.ok) {
        console.error("Failed to update password:", responseData);

        if (responseData.error) {
          toast.error(responseData.error);
        } else {
          toast.error("Failed to update password. Please try again.");
        }
        return;
      }

      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Error updating password.");
    } finally {
      setIsSaving(false);
    }
  }


  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user) {
      toast.error("User not found. Please log in.");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setSelectedImage(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      await user.setProfileImage({ file });
      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      toast.error("Error uploading profile picture.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function addNewEmail() {
  if (!user) {
    toast.error("User not found. Please log in.");
    return;
  }

  if (!newEmail.includes("@")) {
    toast.error("Enter a valid email address.");
    return;
  }

  try {
    // ✅ Step 1: Add new email (unverified)
    const res = await user.createEmailAddress({ email: newEmail });
    await user.reload();

    // ✅ Step 2: Get the newly added email object
    const emailAddress = user.emailAddresses.find((a) => a.id === res.id);
    if (!emailAddress) {
      toast.error("Failed to add email.");
      return;
    }

    setEmailObj(emailAddress);

    // ✅ Step 3: Send verification email
    await emailAddress.prepareVerification({ strategy: "email_code" });

    toast.success("Verification code sent to your email!");
    setShowOtpModal(true); // ✅ Open OTP modal
  } catch (error) {
    console.error("Error adding email:", error);
    toast.error("Failed to add email.");
  }
}

const handleChange = (index: number, value: string) => {
  if (!/^\d?$/.test(value)) return;
  const newOtp = [...emailCode];
  newOtp[index] = value;
  setEmailCode(newOtp);

  if (value !== "" && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};

async function verifyEmail() {
  if (!emailObj) {
    toast.error("Email verification failed.");
    return;
  }

  try {
    const verificationResult = await emailObj.attemptVerification({
      code: emailCode.join(""),
    });

    if (verificationResult?.verification.status === "verified") {
      toast.success("Email verified successfully!");
      setShowOtpModal(false); // ✅ Close modal
      setNewEmail(""); // ✅ Clear input
      setEmailCode(["", "", "", "", "", ""]); // ✅ Reset OTP
    } else {
      toast.error("Incorrect verification code.");
    }
  } catch (error) {
    console.error("Verification failed:", error);
    toast.error("Invalid verification code.");
  }
}


async function deleteEmail(emailId: string) {
  if (!user) {
    toast.error("User not found.");
    return;
  }

  try {
    const emailToDelete = user.emailAddresses.find(
      (email) => email.id === emailId
    );
    if (!emailToDelete) {
      toast.error("Email not found.");
      return;
    }

    await emailToDelete.destroy();
    toast.success("Email deleted!");
    await user.reload();
  } catch (error) {
    console.error("Failed to delete email:", error);
    toast.error("Error deleting email.");
  }
}

async function setAsPrimary(emailId: string) {
  if (!user) {
    toast.error("User not found.");
    return;
  }

  try {
    await user.update({ primaryEmailAddressId: emailId });
    toast.success("Primary email updated!");
    await user.reload();
  } catch (error) {
    console.error("Failed to update primary email:", error);
    toast.error("Error updating primary email.");
  }
}


  return (
    <div className="min-h-screen bg-zinc-950/20 rounded-lg">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Account Settings
          </h1>
          <Button
            variant="destructive"
            size="sm"
            className="ml-auto"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile Section */}
          <div className="space-y-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <img
                      src={selectedImage || user?.imageUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-2 border-teal-400 object-cover"
                    />
                    <label className="absolute bottom-0 right-0 bg-zinc-800 p-2 rounded-full cursor-pointer hover:bg-zinc-700 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-medium text-white">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <PricingTiers currentTier={userData.subscriptionTier} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Management Section */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Email Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user?.emailAddresses
                  .slice()
                  .sort((a, b) =>
                    a.id === user.primaryEmailAddressId ? -1 : 1
                  )
                  .map((email) => (
                    <div
                      key={email.id}
                      className={`group relative flex items-center justify-between p-3 rounded-lg transition-all ${
                        email.id === user.primaryEmailAddressId
                          ? "bg-teal-500/10 border border-teal-500/20"
                          : "hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm text-white truncate">
                          {email.emailAddress}
                        </p>
                        {email.verification?.status === "verified" && (
                          <span className="shrink-0 text-teal-500">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                            </svg>
                          </span>
                        )}
                      </div>
                      {email.id === user.primaryEmailAddressId && (
                        <span className="text-teal-400 text-xs px-2 py-1 bg-teal-600/20 rounded-md">
                          Primary
                        </span>
                      )}
                      {email.id !== user.primaryEmailAddressId && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                          <button
                            className="p-1 hover:text-yellow-400 transition-colors"
                            onClick={() => setAsPrimary(email.id)}
                          >
                            <Star className="w-4 h-4 ml-2" />
                          </button>
                          <button
                            className="p-1 hover:text-red-400 transition-colors"
                            onClick={() => deleteEmail(email.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Settings Section */}
          <div className="space-y-12">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-9">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                      First Name
                    </label>
                    <Input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">
                    Add Email Address
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="Enter new email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <Button
                      onClick={addNewEmail}
                      className="bg-teal-500 hover:bg-teal-600 px-6"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordModal(true)}
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    <Lock className="mr-2 h-4 w-4" /> Change Password
                  </Button>
                  <Button
                    onClick={updateUserProfile}
                    className="bg-teal-500 hover:bg-teal-600 px-6"
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-white">
              Change Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-sm text-zinc-400">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />

            <div className="mt-4">
              <label className="text-sm text-zinc-400 mb-2">
                Confirm New Password
              </label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <Button
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={changePassword}
            >
              Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-white">
              Verify Email Address
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {emailCode.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl bg-zinc-800 border-zinc-700 text-white"
                />
              ))}
            </div>
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={verifyEmail}
            >
              Verify Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
