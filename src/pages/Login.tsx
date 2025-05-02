import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Login: React.FC = () => {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [residesInLocation, setResidesInLocation] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [department, setDepartment] = useState("General");
  const [role, setRole] = useState<"hr" | "employee">("employee");
  const [roleId, setRoleId] = useState<string>("");
  
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(true);
  const { login, signup, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // For debugging
  useEffect(() => {
    console.log("Login component rendering, auth loading state:", isLoading, "user:", user?.id);
  }, [isLoading, user]);

  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user && !isLoading) {
      navigate(user.role === "hr" ? "/hr/dashboard" : "/employee/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLocalLoading(true);
    console.log("Login attempt for email:", email);

    try {
      await login(email, password);
      // The redirection will happen automatically due to the user state change
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLocalLoading(true);

    const fullName = `${firstName} ${lastName}`.trim();
    if (!fullName) {
      setError("Name is required");
      setLocalLoading(false);
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLocalLoading(false);
      return;
    }

    try {
      await signup(signupEmail, signupPassword, fullName, role, department, roleId);
      
      // Clear form fields
      setSignupEmail("");
      setSignupPassword("");
      setFirstName("");
      setLastName("");
      setConfirmPassword("");
      setDepartment("General");
      setRole("employee");
      setRoleId("");
      
      // Switch to login tab
      setIsLoginActive(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  // Show a more specific loading state
  const showLoading = isLoading && !localLoading && !user;
  
  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-blue-300 mb-4" />
          <p className="text-lg text-white">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-black flex flex-col">
      {/* Header - outside of the form area */}
      <div className="w-full py-6 px-10">
        <div className="flex items-center">
          <span className="text-white text-2xl font-light">VibeSense</span>
          <span className="text-[#4ecf2f] text-2xl ml-0">.</span>
          <span className="text-white mx-3">|</span>
          <span className="text-white text-2xl font-light">My VibeSense</span>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow flex">
        {/* Background image section on the left */}
        <div className="w-1/4 relative hidden md:block">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url("/assets/delloite image.jpg")',
              height: '100%',
              width: '100%'
            }}
          />
        </div>
        
        {/* Form and features section - centered more to the left */}
        <div className="flex-grow flex justify-left">
          <div className="w-full max-w-4xl flex">
            {/* Login/Join form section */}
            <div className="w-3/5">
              {/* Tab navigation */}
              <div className="flex">
                <button 
                  className={`w-1/2 py-3 text-center font-medium ${isLoginActive ? 'bg-gray-300 text-gray-800' : 'bg-white text-gray-600'}`}
                  onClick={() => setIsLoginActive(true)}
                >
                  Log in
                </button>
                <button 
                  className={`w-1/2 py-3 text-center font-medium ${!isLoginActive ? 'bg-gray-300 text-gray-800' : 'bg-white text-gray-600'}`}
                  onClick={() => setIsLoginActive(false)}
                >
                  Join
                </button>
              </div>
              
              {/* Form content area with white background */}
              <div className="bg-white p-8 text-gray-800">
                {isLoginActive ? (
                  /* Login Form */
                  <>
                    <h2 className="text-xl font-medium mb-6">
                      Welcome back
                    </h2>
                    
                    {error && (
                      <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-sm">
                        {error}
                      </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                      {/* Email field */}
                      <div className="form-field">
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800"
                            required
                          />
                          <label 
                            htmlFor="email" 
                            className={`form-field__label absolute left-2 ${email ? 'text-xs top-1' : 'text-sm top-1/2 -translate-y-1/2'} transition-all text-gray-500`}
                          >
                            Email*
                          </label>
                          <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                        </div>
                      </div>
                      
                      {/* Password field */}
                      <div className="form-field">
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800"
                            required
                          />
                          <label 
                            htmlFor="password" 
                            className={`form-field__label absolute left-2 ${password ? 'text-xs top-1' : 'text-sm top-1/2 -translate-y-1/2'} transition-all text-gray-500`}
                          >
                            Password*
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                        </div>
                      </div>
                      
                      {/* Forgot password link */}
                      <div className="flex justify-end">
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                      </div>
                      
                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={localLoading}
                        className="w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors mt-4"
                      >
                        {localLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 size={16} className="animate-spin mr-2" />
                            Logging in...
                          </span>
                        ) : (
                          "Log in"
                        )}
                      </button>
                    </form>
                    
                    {/* Or divider */}
                    <div className="mt-8 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-6 py-1 bg-white text-gray-500 uppercase text-center font-medium">OR</span>
                        </div>
                      </div>
                      
                      {/* Social login buttons */}
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="12" fill="#fff"/>
                            <path d="M12 11V8M12 14H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33974 16C2.56986 17.3333 3.53217 19 5.07183 19Z" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#0077B5"/>
                            <path d="M8 17H5V8H8V17Z" fill="white"/>
                            <path d="M6.5 6.5C5.67157 6.5 5 5.82843 5 5C5 4.17157 5.67157 3.5 6.5 3.5C7.32843 3.5 8 4.17157 8 5C8 5.82843 7.32843 6.5 6.5 6.5Z" fill="white"/>
                            <path d="M18 17H15V12.5C15 11.5 14.5 10.5 13.5 10.5C12.5 10.5 12 11.5 12 12.5V17H9V8H12V9.5C12.5 8.5 13.8 8 14.5 8C16.5 8 18 9.5 18 11.5V17Z" fill="white"/>
                          </svg>
                        </button>
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <g>
                              <rect width="24" height="24" fill="#3b5998"/>
                              <path d="M8 14v2h3v8h3v-8h3.257l.544-4H14V9c0-1.096.643-2 2-2h2V3h-2c-2.751 0-5 2.249-5 5v4H8z" fill="#fff"/>
                            </g>
                          </svg>
                        </button>
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="12" fill="#fff"/>
                            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" fill="#4285F4"/>
                            <path d="M12 4V9L16 12L20 12C20 7.58172 16.4183 4 12 4Z" fill="#EA4335"/>
                            <path d="M20 12L16 15H12V20C16.4183 20 20 16.4183 20 12Z" fill="#34A853"/>
                            <path d="M8 15L4 12C4 16.4183 7.58172 20 12 20V15H8Z" fill="#FBBC05"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Not a member link */}
                    <div className="mt-8 border-t border-gray-300 pt-4 pb-4 text-center">
                      <p className="text-sm text-gray-600">
                        Not a member yet? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginActive(false); }} className="text-blue-600 hover:underline">Join now</a>
                      </p>
                    </div>
                  </>
                ) : (
                  /* Join Form */
                  <>
                    <h2 className="text-xl font-medium mb-6">
                      Join VibeSense by linking your email or social media profile
                    </h2>
                    
                    {error && (
                      <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-sm">
                        {error}
                      </div>
                    )}
                    
                    {/* Preferred site & language dropdown */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-600">Preferred site & language</label>
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          <HelpCircle size={14} />
                        </span>
                      </div>
                      <div className="relative mb-4">
                        <div className="site-language-dropdown flex justify-between p-2 border border-gray-300 rounded cursor-pointer bg-white">
                          <p className="site-language text-gray-800">India (English)</p>
                          <span className="icon-chevron-down text-gray-500">▼</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <input 
                          type="checkbox" 
                          id="location" 
                          className="mr-2"
                          checked={residesInLocation}
                          onChange={() => setResidesInLocation(!residesInLocation)}
                        />
                        <label htmlFor="location" className="text-sm font-medium text-gray-600">I reside in this location</label>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSignup} className="space-y-4">
                      {/* Email field */}
                      <div className="form-field">
                        <div className="relative">
                          <input
                            id="signup-email"
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800"
                            required
                          />
                          <label 
                            htmlFor="signup-email" 
                            className={`form-field__label absolute left-2 ${signupEmail ? 'text-xs top-1' : 'text-sm top-1/2 -translate-y-1/2'} transition-all text-gray-500`}
                          >
                            Email*
                          </label>
                          <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                        </div>
                      </div>
                      
                      {/* First name and Last name fields */}
                      <div className="flex gap-4">
                        <div className="w-1/2 form-field">
                          <div className="relative">
                            <input
                              id="firstname"
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800"
                              required
                            />
                            <label 
                              htmlFor="firstname" 
                              className={`form-field__label absolute left-2 ${firstName ? 'text-xs top-1' : 'text-sm top-1/2 -translate-y-1/2'} transition-all text-gray-500`}
                            >
                              First name*
                            </label>
                            <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                          </div>
                        </div>
                        <div className="w-1/2 form-field">
                          <div className="relative">
                            <input
                              id="lastname"
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800"
                              required
                            />
                            <label 
                              htmlFor="lastname" 
                              className={`form-field__label absolute left-2 ${lastName ? 'text-xs top-1' : 'text-sm top-1/2 -translate-y-1/2'} transition-all text-gray-500`}
                            >
                              Last name*
                            </label>
                            <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                          </div>
                        </div>
                      </div>
                      
                      {/* Password and Confirm Password fields */}
                      <div className="flex gap-4">
                        <div className="w-1/2 form-field">
                          <div className="relative">
                            <input
                              id="signup-password"
                              type={showSignupPassword ? "text" : "password"}
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800"
                              required
                            />
                            <label 
                              htmlFor="signup-password" 
                              className={`form-field__label absolute left-2 ${signupPassword ? 'text-xs top-1' : 'text-sm top-1/2 -translate-y-1/2'} transition-all text-gray-500`}
                            >
                              Password*
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                          </div>
                        </div>
                        <div className="w-1/2 form-field">
                          <div className="relative">
                            <input
                              id="confirmPassword"
                              type={showSignupPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800"
                              required
                            />
                            <label 
                              htmlFor="confirmPassword" 
                              className={`form-field__label absolute left-2 ${confirmPassword ? 'text-xs top-1' : 'text-sm top-1/2 -translate-y-1/2'} transition-all text-gray-500`}
                            >
                              Re-type password*
                            </label>
                            <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                          </div>
                        </div>
                      </div>
                      
                      {/* Department field */}
                      <div className="form-field">
                        <div className="relative">
                          <select
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800 appearance-none"
                            required
                          >
                            <option value="General">General</option>
                            <option value="HR">Human Resources</option>
                            <option value="IT">Information Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Operations">Operations</option>
                            <option value="Sales">Sales</option>
                          </select>
                          <label 
                            htmlFor="department" 
                            className="form-field__label absolute left-2 text-xs top-1 transition-all text-gray-500"
                          >
                            Department*
                          </label>
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
                          <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                        </div>
                      </div>
                      
                      {/* Role selection field */}
                      <div className="form-field">
                        <div className="relative">
                          <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as "hr" | "employee")}
                            className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800 appearance-none"
                            required
                          >
                            <option value="employee">Employee</option>
                            <option value="hr">HR Manager</option>
                          </select>
                          <label 
                            htmlFor="role" 
                            className="form-field__label absolute left-2 text-xs top-1 transition-all text-gray-500"
                          >
                            Role*
                          </label>
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
                          <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                        </div>
                      </div>
                      
                      {/* Role ID field */}
                      <div className="form-field">
                        <div className="relative">
                          <input
                            id="roleId"
                            type="text"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className="w-full p-2 rounded border border-gray-300 pt-6 pb-2 bg-white text-gray-800"
                          />
                          <label 
                            htmlFor="roleId" 
                            className={`form-field__label absolute left-2 ${roleId ? 'text-xs top-1' : 'text-sm top-1/2 -translate-y-1/2'} transition-all text-gray-500`}
                          >
                            Role ID (Optional)
                          </label>
                          <i className="bar absolute bottom-0 left-0 w-full h-0.5 bg-transparent"></i>
                        </div>
                      </div>
                      
                      {/* Password requirements text */}
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        8+ characters, including 3 of the following: an uppercase letter, a lowercase letter, a number, and a special character.
                      </p>
                      
                      {/* Terms and conditions checkbox */}
                      <div className="pt-2">
                        <div className="flex items-center">
                          <div className="checkbox">
                            <label htmlFor="terms" className="flex items-start">
                              <input 
                                type="checkbox" 
                                id="terms" 
                                className="mt-1 mr-2"
                                checked={acceptedTerms}
                                onChange={() => setAcceptedTerms(!acceptedTerms)}
                                required
                              />
                              <span className="text-sm text-gray-600">
                                I have read and accept the <a href="#" className="text-blue-600">terms of use</a>.
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={localLoading}
                        className="w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                      >
                        {localLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 size={16} className="animate-spin mr-2" />
                            Joining...
                          </span>
                        ) : (
                          "Join"
                        )}
                      </button>
                    </form>
                    
                    {/* Or divider */}
                    <div className="mt-8 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-6 py-1 bg-white text-gray-500 uppercase text-center font-medium">OR</span>
                        </div>
                      </div>
                      
                      {/* Social login buttons */}
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="12" fill="#fff"/>
                            <path d="M12 11V8M12 14H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33974 16C2.56986 17.3333 3.53217 19 5.07183 19Z" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#0077B5"/>
                            <path d="M8 17H5V8H8V17Z" fill="white"/>
                            <path d="M6.5 6.5C5.67157 6.5 5 5.82843 5 5C5 4.17157 5.67157 3.5 6.5 3.5C7.32843 3.5 8 4.17157 8 5C8 5.82843 7.32843 6.5 6.5 6.5Z" fill="white"/>
                            <path d="M18 17H15V12.5C15 11.5 14.5 10.5 13.5 10.5C12.5 10.5 12 11.5 12 12.5V17H9V8H12V9.5C12.5 8.5 13.8 8 14.5 8C16.5 8 18 9.5 18 11.5V17Z" fill="white"/>
                          </svg>
                        </button>
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <g>
                              <rect width="24" height="24" fill="#3b5998"/>
                              <path d="M8 14v2h3v8h3v-8h3.257l.544-4H14V9c0-1.096.643-2 2-2h2V3h-2c-2.751 0-5 2.249-5 5v4H8z" fill="#fff"/>
                            </g>
                          </svg>
                        </button>
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="12" fill="#fff"/>
                            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" fill="#4285F4"/>
                            <path d="M12 4V9L16 12L20 12C20 7.58172 16.4183 4 12 4Z" fill="#EA4335"/>
                            <path d="M20 12L16 15H12V20C16.4183 20 20 16.4183 20 12Z" fill="#34A853"/>
                            <path d="M8 15L4 12C4 16.4183 7.58172 20 12 20V15H8Z" fill="#FBBC05"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Already a member link */}
                    <div className="mt-8 border-t border-gray-300 pt-4 pb-4 text-center">
                      <p className="text-sm text-gray-600">
                        Already a member? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginActive(true); }} className="text-blue-600 hover:underline">Log in</a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Features column */}
            <div className="w-2/5 p-8 bg-black text-white hidden md:block">
              <h2 className="text-2xl mb-6 text-white">Make VibeSense yours</h2>
              <p className="text-gray-300 mb-6">Join, customize, and connect</p>
              
              <div className="mb-8">
                <div className="flex items-start mb-6">
                  <div className="bg-gray-800 rounded-full p-3 mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C4 5 2 7 2 10V16C2 19 4 21 7 21H17C20 21 22 19 22 16V10C22 7 20 5 17 5H15" stroke="#999" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12V3" stroke="#999" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 6L12 3L15 6" stroke="#999" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-white">Personalized content feed</h3>
                    <p className="text-sm text-gray-300">Select your topics of interest to curate a content feed and receive tailored content</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="bg-gray-800 rounded-full p-3 mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="#999" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#999" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 9H4.71M19.29 9H22M2 15H4.71M19.29 15H22" stroke="#999" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-white">Email subscriptions</h3>
                    <p className="text-sm text-gray-300">Subscribe to newsletters, webcasts, and more to be delivered straight to your inbox</p>
                  </div>
                </div>
                
                {/* Privacy statement */}
                <div className="bg-gray-800 p-4 rounded text-sm text-gray-300 mt-6">
                  <p>
                    Please read our <a href="#" className="text-blue-300 hover:underline">privacy statement</a> to understand how we plan to use your personal information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
