import { useToast } from "../Components/ToastProvider";

// This is a utility file that provides easy access to toast functions
// Components should import and use the useToast hook directly

export const showToast = {
  success: (message, options = {}) => {
    // This will be used by components that import useToast hook
    console.warn("showToast.success() should be used within a component with useToast hook");
    return null;
  },
  
  error: (message, options = {}) => {
    console.warn("showToast.error() should be used within a component with useToast hook");
    return null;
  },
  
  loading: (message, options = {}) => {
    console.warn("showToast.loading() should be used within a component with useToast hook");
    return null;
  },
  
  dismiss: (toastId) => {
    console.warn("showToast.dismiss() should be used within a component with useToast hook");
  },
  
  promise: async (promise, messages) => {
    console.warn("showToast.promise() should be used within a component with useToast hook");
    return promise;
  }
};

// Export the hook for direct use in components
export { useToast };
