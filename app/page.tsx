"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const response = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (!response?.ok) {
        console.log(response);
        if (response?.error?.includes("Adresse E-mail incorrect")) {
          toast.error("Adresse E-mail incorrect", {
            style: { color: "#EF4444" },
            position: "top-right",
          });
        }
        if (response?.error?.includes("Mot de passe incorrect")) {
          toast.error("Mot de passe incorrect", {
            style: { color: "#EF4444" },
            position: "top-right",
          });
        }
        if (
          response?.error?.includes(
            "Vous n'êtes pas autorisé à accéder à cette application"
          )
        ) {
          toast.error(
            "Vous n'êtes pas autorisé à accéder à cette application",
            {
              style: { color: "#EF4444" },
              position: "top-right",
            }
          );
        }
      } else {
        toast.success("Connexion réussie !", {
          style: { color: "#10B981" },
          position: "top-right",
        });
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      setErrors({ submit: "Erreur lors de la connexion" });
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
        { style: { color: "#EF4444" }, position: "top-right" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-white rounded-[10px] shadow-lg p-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h2 className="text-3xl font-bold capitalize text-black/70">yodi</h2>
        </div>
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-[10px]">
            {errors.submit}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black/60 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-[10px] focus:outline-none focus:border-[#A36F5E]`}
              placeholder="Entrez votre email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-black/60 mb-2">
              Mot de passe
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } rounded-[10px] focus:outline-none focus:border-[#A36F5E]`}
              placeholder="Entrez votre mot de passe"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {isPasswordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex cursor-pointer items-center justify-center bg-[#A36F5E] text-black px-4 py-2 rounded-[10px] font-medium hover:bg-black hover:text-[#A36F5E] transition-colors duration-300 mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
