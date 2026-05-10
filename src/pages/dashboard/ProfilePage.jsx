/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Camera,
  Loader2,
  User2,
  MapPin,
  Globe,
  MessageCircleHeart,
} from "lucide-react";

import api from "../../api/axios";
import useAuthStore from "../../store/authStore";

const inputStyles =
  "w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

const ProfilePage = () => {
  const { user, setUser } =
    useAuthStore();

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [file, setFile] =
    useState(null);

  const [formData, setFormData] =
    useState({
      full_name: "",
      bio: "",
      state: "",
      city: "",
      whatsapp: "",
      instagram: "",
      twitter: "",
      tiktok: "",
      website: "",
    });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name:
          user.full_name || "",
        bio: user.bio || "",
        state: user.state || "",
        city: user.city || "",
        whatsapp:
          user.whatsapp || "",
        instagram:
          user.instagram || "",
        twitter:
          user.twitter || "",
        tiktok:
          user.tiktok || "",
        website:
          user.website || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      Object.keys(formData).forEach(
        (key) => {
          data.append(
            key,
            formData[key]
          );
        }
      );

      if (file) {
        data.append(
          "profile_image",
          file
        );
      }

      const res = await api.patch(
        "/users/me",
        data
      );

      setUser(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-violet-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-violet-700 via-violet-600 to-fuchsia-500 p-8 sm:p-10 text-white">
          <div className="absolute -top-25 -right-20 w-62.5 h-62.5 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-30 -left-25 w-62.5 h-62.5 rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative">
              <img
                src={
                  file
                    ? URL.createObjectURL(
                        file
                      )
                    : user?.profile_image ||
                      "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white/20 shadow-2xl"
              />

              <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white text-violet-700 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition">
                <Camera size={18} />

                <input
                  type="file"
                  hidden
                  onChange={
                    handleImageChange
                  }
                />
              </label>
            </div>

            <div>
              <p className="text-violet-100 text-sm font-medium mb-2">
                Your public profile
              </p>

              <h1 className="text-3xl sm:text-4xl font-black">
                {user?.full_name}
              </h1>

              <p className="mt-2 text-violet-100">
                @{user?.username}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white border border-gray-200 rounded-4xl p-6 sm:p-8 shadow-sm space-y-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center">
                <User2 className="text-violet-700" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>

                <p className="text-sm text-gray-500">
                  Update your profile
                  details
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Full name
                </label>

                <input
                  name="full_name"
                  value={
                    formData.full_name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="John Doe"
                  className={
                    inputStyles
                  }
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Bio
                </label>

                <textarea
                  rows="5"
                  name="bio"
                  value={formData.bio}
                  onChange={
                    handleChange
                  }
                  placeholder="Tell people about yourself and the services you offer..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none resize-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    State
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      name="state"
                      value={
                        formData.state
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Lagos"
                      className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Ikeja"
                    className={
                      inputStyles
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center">
                <Globe className="text-violet-700" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Social Links
                </h2>

                <p className="text-sm text-gray-500">
                  Help people connect
                  with you
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                name="whatsapp"
                value={
                  formData.whatsapp
                }
                onChange={
                  handleChange
                }
                placeholder="WhatsApp number"
                className={
                  inputStyles
                }
              />

              <input
                name="instagram"
                value={
                  formData.instagram
                }
                onChange={
                  handleChange
                }
                placeholder="Instagram username"
                className={
                  inputStyles
                }
              />

              <input
                name="twitter"
                value={
                  formData.twitter
                }
                onChange={
                  handleChange
                }
                placeholder="Twitter/X username"
                className={
                  inputStyles
                }
              />

              <input
                name="tiktok"
                value={
                  formData.tiktok
                }
                onChange={
                  handleChange
                }
                placeholder="TikTok username"
                className={
                  inputStyles
                }
              />

              <div className="md:col-span-2">
                <input
                  name="website"
                  value={
                    formData.website
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Website URL"
                  className={
                    inputStyles
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircleHeart
                size={16}
              />
              Your profile helps clients
              trust your services
            </div>

            <button
              disabled={saving}
              className="h-12 px-7 rounded-2xl bg-violet-700 hover:bg-violet-800 text-white font-semibold transition disabled:opacity-70 shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;