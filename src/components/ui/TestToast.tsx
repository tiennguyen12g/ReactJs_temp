import React, { useMemo } from "react";
import Notification, { type NotificationType, type NotificationPosition } from "./toast";
import { useToastSeri } from "../../hooks/useToastSeri";

// Helper function to get position classes
const getPositionClasses = (position: NotificationPosition = "top-right"): string => {
  const positionMap: Record<NotificationPosition, string> = {
    "top-left": "fixed top-4 left-4",
    "top-center": "fixed top-4 left-1/2 -translate-x-1/2",
    "top-right": "fixed top-4 right-4",
    "bottom-left": "fixed bottom-4 left-4",
    "bottom-center": "fixed bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "fixed bottom-4 right-4",
  };
  return positionMap[position];
};

export default function TestToast() {
  const { notificationToasts, successToast, errorToast, warningToast, infoToast, loadingToast, removeToast, setNotificationToasts, addToast } = useToastSeri();

  // Group toasts by position
  const toastsByPosition = useMemo(() => {
    const grouped: Record<NotificationPosition, typeof notificationToasts> = {
      "top-left": [],
      "top-center": [],
      "top-right": [],
      "bottom-left": [],
      "bottom-center": [],
      "bottom-right": [],
    };

    notificationToasts.forEach((toast) => {
      const position = toast.position || "top-right";
      grouped[position].push(toast);
    });

    return grouped;
  }, [notificationToasts]);

  const handleSubmit = async () => {
    try {
      loadingToast("Processing...", "Please wait", "top-center");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      successToast("Success!", "Data saved successfully", 3000, "top-center");
    } catch (err) {
      errorToast("Error!", "Failed to save data", 5000, "top-center");
    }
  };

  const handlePayment = () => {
    const loadingId = addToast("loading", "Processing Payment", "Please wait...");
    // Simulate payment processing
    setTimeout(() => {
      // Replace loading with success
      setNotificationToasts((prev) =>
        prev.map((toast) => (toast.id === loadingId ? { ...toast, type: "success", title: "Payment Successful!", duration: 4000 } : toast))
      );
    }, 3000);
  };
  const handleTestPositions = () => {
    successToast("Top Right", "Default position", 3000, "top-right");
    errorToast("Top Left", "Error at top left", 3000, "top-left");
    warningToast("Top Center", "Warning at center", 3000, "top-center");
    infoToast("Bottom Right", "Info at bottom right", 3000, "bottom-right");
    loadingToast("Bottom Left", "Loading at bottom left", "bottom-left");
  };

  const handleFormSubmit = async () => {
  try {
    loadingToast('Submitting...', 'Please wait');
    setTimeout(() => {
          successToast('Success!', 'Form submitted successfully');
    },3000)

  } catch (error: any) {
    errorToast('Error!', error.message);
  }
};



  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Notification Examples</h2>

      {/* Test Buttons */}
      <div className="space-x-2">
        <button onClick={handlePayment} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Test Payment
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Test Submit Flow
        </button>
        <button onClick={handleTestPositions} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Test All Positions
        </button>
                <button onClick={handleFormSubmit} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Test form submit
        </button>
        <button
          onClick={() => successToast("Custom Style", "With custom className", 3000, "top-right", "bg-purple-500 border-purple-600")}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Custom ClassName
        </button>
      </div>

      {/* Render toasts grouped by position */}
      {(Object.keys(toastsByPosition) as NotificationPosition[]).map((position) => {
        const toasts = toastsByPosition[position];
        if (toasts.length === 0) return null;

        return (
          <div key={position} className={`${getPositionClasses(position)} z-50 space-y-2`}>
            {toasts.map((toast) => (
              <Notification key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
