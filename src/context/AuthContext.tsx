import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "hr" | "employee";
  role_id?: string;
  department?: string;
  avatar?: string;
  avatar_url?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: "hr" | "employee", department: string, roleId?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to safely fetch user profile using our security definer function
  const fetchProfile = async (userId: string) => {
    console.log("Fetching profile for user:", userId);
    try {
      const { data, error } = await supabase
        .rpc('get_profile', { profile_id: userId });
        
      if (error) {
        console.error('Error fetching user profile via RPC:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Profile successfully fetched:", data[0]);
        return data[0];
      }
      
      console.log("Profile not found for user:", userId);
      throw new Error('Profile not found');
    } catch (error) {
      console.error('Error in fetchProfile function:', error);
      return null;
    }
  };

  // Function to create or update a profile
  const createOrUpdateProfile = async (userData: {
    id: string;
    name: string;
    role: string;
    role_id?: string;
    department?: string;
  }) => {
    try {
      // Ensure we have valid data
      const profileData = {
        id: userData.id,
        name: userData.name || 'User',
        role: userData.role || 'employee',
        role_id: userData.role_id || null,
        department: userData.department || 'General'
      };
      
      console.log("Creating/updating profile with data:", JSON.stringify(profileData));
      
      // Use upsert to handle both creation and updates
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();
        
      if (error) {
        console.error('Profile upsert failed:', error.message);
        return null;
      }
      
      console.log("Profile successfully upserted:", data);
      return data;
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log("AuthProvider initializing...");
    
    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        if (!mounted) return;
        
        setSession(currentSession);
        
        if (!currentSession) {
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }
        
        // Process the authenticated user
        try {
          // Check if profile exists
          const profileData = await fetchProfile(currentSession.user.id);
          
          if (profileData) {
            // Profile exists, use it
            if (mounted) {
              setUser({
                id: profileData.id,
                name: profileData.name,
                email: currentSession.user.email || '',
                role: profileData.role as "hr" | "employee",
                role_id: profileData.role_id || undefined,
                department: profileData.department,
                avatar_url: profileData.avatar_url,
                avatar: profileData.avatar_url
              });
              setIsLoading(false);
            }
          } else {
            // No profile, create one from user metadata
            const metadata = currentSession.user.user_metadata || {};
            const email = currentSession.user.email || '';
            
            const newProfile = await createOrUpdateProfile({
              id: currentSession.user.id,
              name: metadata.name || metadata.full_name || email.split('@')[0] || 'User',
              role: metadata.role || 'employee',
              role_id: metadata.role_id || null,
              department: metadata.department || 'General'
            });
            
            if (mounted) {
              if (newProfile) {
                // Profile created successfully
                setUser({
                  id: newProfile.id,
                  name: newProfile.name,
                  email: email,
                  role: newProfile.role as "hr" | "employee",
                  role_id: newProfile.role_id || undefined,
                  department: newProfile.department,
                  avatar_url: newProfile.avatar_url,
                  avatar: newProfile.avatar_url
                });
              } else {
                // Fallback to basic user data
                setUser({
                  id: currentSession.user.id,
                  name: metadata.name || metadata.full_name || email.split('@')[0] || 'User',
                  email: email,
                  role: (metadata.role || 'employee') as "hr" | "employee",
                  role_id: metadata.role_id || undefined,
                  department: metadata.department || 'General'
                });
              }
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.error('Error in session handling:', error);
          
          if (mounted) {
            // Fallback to basic user data from auth
            const metadata = currentSession.user.user_metadata || {};
            const email = currentSession.user.email || '';
            
            setUser({
              id: currentSession.user.id,
              name: metadata.name || metadata.full_name || email.split('@')[0] || 'User',
              email: email,
              role: (metadata.role || 'employee') as "hr" | "employee",
              role_id: metadata.role_id || undefined,
              department: metadata.department || 'General'
            });
            setIsLoading(false);
          }
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession?.user?.id);
      
      if (!mounted) return;
      
      if (!initialSession) {
        setIsLoading(false);
      }
      // Don't set session here, let onAuthStateChange handle it
    }).catch(error => {
      console.error('Error getting initial session:', error);
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log("Attempting login for email:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Login successful for user:", email);
      toast({
        title: "Login successful",
        description: `Welcome back${data.user ? ', ' + (data.user.user_metadata?.name || email.split('@')[0]) : ''}`,
      });
      
      // Successfully logged in - the onAuthStateChange listener will update the user state
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
      setIsLoading(false); // Only set loading to false on error
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: "hr" | "employee", department: string, roleId?: string) => {
    setIsLoading(true);
    
    console.log("Starting signup with role_id:", roleId);
    
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            department,
            role_id: roleId || null
          },
        },
      });
      
      if (error) throw error;
      
      console.log("Auth signup successful, user metadata:", data?.user?.user_metadata);
      
      // Profile will be created on first login via the auth state change handler
      toast({
        title: "Registration successful",
        description: "You have been registered successfully. Please check your email to confirm your account.",
      });
      
      return Promise.resolve();
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create an account. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Failed to log out. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    session,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};