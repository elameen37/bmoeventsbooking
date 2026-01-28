import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { UserRoleManagement } from "@/components/admin/UserRoleManagement";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useIsAdmin();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin && user) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, user, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-6 sm:px-8 lg:px-12">
          <div className="container mx-auto max-w-5xl">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">User Management</h1>
              <p className="text-muted-foreground">
                Assign and manage user roles for the platform
              </p>
            </div>
          </div>

          {/* Info Card */}
          <div className="mb-8 p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Role Permissions</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>
                    <strong>Admin:</strong> Full access to all features, can manage users and roles
                  </li>
                  <li>
                    <strong>Manager:</strong> Can view and manage bookings, update arena availability
                  </li>
                  <li>
                    <strong>Staff:</strong> Can view bookings and arena information
                  </li>
                  <li>
                    <strong>Customer:</strong> Can create and view their own bookings
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Role Table */}
          <UserRoleManagement />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserManagementPage;
