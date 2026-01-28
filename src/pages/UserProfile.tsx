import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Camera, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Unable to load profile. Please try again.",
        variant: "destructive",
      });
    } else if (data) {
      // If avatar_url is a file path (not a full URL), generate a signed URL
      let profileWithSignedUrl = { ...data };
      if (data.avatar_url && !data.avatar_url.startsWith('http')) {
        const { data: signedUrlData } = await supabase.storage
          .from("avatars")
          .createSignedUrl(data.avatar_url, 3600);
        if (signedUrlData) {
          profileWithSignedUrl.avatar_url = signedUrlData.signedUrl;
        }
      }
      setProfile(profileWithSignedUrl);
      setDisplayName(data.display_name || "");
      setBio(data.bio || "");
    } else {
      // Profile doesn't exist, create one
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({ user_id: user.id, display_name: user.email })
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
      } else {
        setProfile(newProfile);
        setDisplayName(newProfile.display_name || "");
        setBio(newProfile.bio || "");
      }
    }
    setIsLoading(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    // Delete old avatar if exists
    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split("/").slice(-2).join("/");
      await supabase.storage.from("avatars").remove([oldPath]);
    }

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast({
        title: "Upload failed",
        description: "Unable to upload avatar. Please try again.",
        variant: "destructive",
      });
      setIsUploadingAvatar(false);
      return;
    }

    // Get signed URL for private bucket (1 hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("avatars")
      .createSignedUrl(fileName, 3600);

    if (signedUrlError || !signedUrlData) {
      console.error("Signed URL error:", signedUrlError);
      toast({
        title: "Error",
        description: "Unable to process avatar. Please try again.",
        variant: "destructive",
      });
      setIsUploadingAvatar(false);
      return;
    }

    // Store the file path in profile (not the signed URL, which expires)
    // We'll generate fresh signed URLs when displaying
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: fileName })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      toast({
        title: "Error",
        description: "Unable to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      setProfile(prev => prev ? { ...prev, avatar_url: signedUrlData.signedUrl } : null);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });
    }

    setIsUploadingAvatar(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Unable to save changes. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const inputClassName = `
    w-full px-4 py-3 rounded-xl text-white/90 text-sm
    transition-all duration-500
    placeholder:text-white/30
    focus:outline-none
  `;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#000000' }}>
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#000000' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <ArrowLeft size={16} className="text-white/60 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-white/70">Back</span>
      </button>

      <div 
        className="w-full max-w-md p-8 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div 
            className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleAvatarClick}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.1)',
            }}
          >
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={40} className="text-white/40" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploadingAvatar ? (
                <Loader2 size={24} className="text-white animate-spin" />
              ) : (
                <Camera size={24} className="text-white" />
              )}
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          
          <p className="mt-3 text-white/40 text-xs">Click to change avatar</p>
          <p className="text-white/50 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/50 text-xs mb-2 ml-1">Display Name</label>
            <input
              type="text"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className={inputClassName}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs mb-2 ml-1">Bio</label>
            <textarea
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={4}
              className={`${inputClassName} resize-none`}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <p className="text-white/30 text-xs mt-1 text-right">{bio.length}/500</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin text-white/90" />
            ) : (
              <Save size={18} className="text-white/90" />
            )}
            <span className="text-white/90">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <span className="text-red-400">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
