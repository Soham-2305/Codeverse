// "use client";

// import { useState, useEffect } from "react";
// import { User, Mail, Lock, Save, Shield, Camera, Calendar, CreditCard, Monitor } from "lucide-react";

// export default function ProfilePage() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [profilePhoto, setProfilePhoto] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [panCardNumber, setPanCardNumber] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   async function fetchUserProfile() {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/user/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setFullName(data.fullName || "");
//         setEmail(data.email || "");
//         setProfilePhoto(data.profilePhoto || "");
//         setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.split('T')[0] : "");
//         setPanCardNumber(data.panCardNumber || "");
//         setDevices(data.devices || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch profile:", error);
//     }
//   }

//   function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   async function handleUpdateProfile() {
//     setLoading(true);
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("/api/user/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           fullName,
//           email,
//           profilePhoto,
//           dateOfBirth,
//           panCardNumber,
//           currentPassword: currentPassword || undefined,
//           newPassword: newPassword || undefined,
//         }),
//       });

//       if (res.ok) {
//         setMessage("Profile updated successfully!");
//         setCurrentPassword("");
//         setNewPassword("");
//         fetchUserProfile(); // Refresh to show updated devices
//       } else {
//         const data = await res.json();
//         setMessage(data.error || "Update failed");
//       }
//     } catch (error) {
//       setMessage("An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
//           <p className="text-gray-500 mt-1">Manage your account details and security</p>
//         </div>
//         <div className="bg-blue-100 p-3 rounded-xl">
//           <Shield className="w-6 h-6 text-blue-600" />
//         </div>
//       </div>

//       {/* Profile Photo Section */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Photo</h2>
//         <div className="flex items-center gap-6">
//           <div className="relative">
//             {profilePhoto ? (
//               <img
//                 src={profilePhoto}
//                 alt="Profile"
//                 className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
//               />
//             ) : (
//               <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
//                 <User className="w-12 h-12 text-gray-400" />
//               </div>
//             )}
//             <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-all shadow-lg">
//               <Camera className="w-4 h-4 text-white" />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePhotoUpload}
//                 className="hidden"
//               />
//             </label>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-700">Upload Profile Picture</p>
//             <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB (Optional)</p>
//           </div>
//         </div>
//       </div>

//       {/* Personal Information */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

//         <div className="space-y-5">
//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Full Name
//             </label>
//             <div className="relative">
//               <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Enter your full name"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="your.email@example.com"
//               />
//             </div>
//           </div>

//           {/* Date of Birth */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Date of Birth <span className="text-gray-400 text-xs">(Optional)</span>
//             </label>
//             <div className="relative">
//               <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="date"
//                 value={dateOfBirth}
//                 onChange={(e) => setDateOfBirth(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               />
//             </div>
//           </div>

//           {/* PAN Card Number */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               PAN Card Number <span className="text-gray-400 text-xs">(Optional)</span>
//             </label>
//             <div className="relative">
//               <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={panCardNumber}
//                 onChange={(e) => setPanCardNumber(e.target.value.toUpperCase())}
//                 maxLength={10}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
//                 placeholder="ABCDE1234F"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Security Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
//         <p className="text-sm text-gray-500 mb-6">Leave blank to keep your current password</p>

//         <div className="space-y-5">
//           {/* Current Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Current Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Enter current password"
//               />
//             </div>
//           </div>

//           {/* New Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               New Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Enter new password"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Devices Section */}
//       {devices.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//           <div className="flex items-center gap-2 mb-6">
//             <Monitor className="w-5 h-5 text-gray-700" />
//             <h2 className="text-xl font-semibold text-gray-900">Connected Devices</h2>
//           </div>
//           <div className="space-y-3">
//             {devices.map((device: any, index: number) => (
//               <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                 <div>
//                   <p className="font-medium text-gray-900">Device {index + 1}</p>
//                   <p className="text-sm text-gray-500">IP: {device.ipAddress || "Unknown"}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-500">Last seen</p>
//                   <p className="text-sm font-medium text-gray-700">
//                     {new Date(device.lastSeenAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Message */}
//       {message && (
//         <div
//           className={`p-4 rounded-xl ${
//             message.includes("success")
//               ? "bg-green-50 text-green-700 border border-green-200"
//               : "bg-red-50 text-red-700 border border-red-200"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* Save Button */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleUpdateProfile}
//           disabled={loading}
//           className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
//         >
//           <Save className="w-5 h-5" />
//           {loading ? "Saving..." : "Save Changes"}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Save, Shield, Camera, Calendar, CreditCard, Monitor } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [panCardNumber, setPanCardNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setMessage("Please login first");
        router.push("/auth/login");
        return;
      }

      console.log("Token being sent:", token); // Debug log

      const res = await fetch("/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setProfilePhoto(data.profilePhoto || "");
        setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.split('T')[0] : "");
        setPanCardNumber(data.panCardNumber || "");
        setDevices(data.devices || []);
      } else {
        const error = await res.json();
        console.error("Profile fetch error:", error);
        setMessage(error.error || "Failed to load profile");
        
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setMessage("Network error. Please try again.");
    }
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage("Image size must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleUpdateProfile() {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setMessage("Please login first");
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          email,
          profilePhoto,
          dateOfBirth,
          panCardNumber,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          fetchUserProfile(); // Refresh to show updated devices
        }, 500);
      } else {
        const data = await res.json();
        setMessage(data.error || "Update failed");
        
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account details and security</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-xl">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Profile Photo Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-all shadow-lg">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Upload Profile Picture</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB (Optional)</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* PAN Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAN Card Number <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={panCardNumber}
                onChange={(e) => setPanCardNumber(e.target.value.toUpperCase())}
                maxLength={10}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                placeholder="ABCDE1234F"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
        <p className="text-sm text-gray-500 mb-6">Leave blank to keep your current password</p>

        <div className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter current password"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter new password"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Devices Section */}
      {devices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Connected Devices</h2>
          </div>
          <div className="space-y-3">
            {devices.map((device: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Device {index + 1}</p>
                  <p className="text-sm text-gray-500">IP: {device.ipAddress || "Unknown"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last seen</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(device.lastSeenAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.includes("success")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}