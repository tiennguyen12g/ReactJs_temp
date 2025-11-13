import React, { useState } from "react";
import Button from "./button";
import { ConfirmDelete, BaseNotification, ConfirmLogout, ResetSettingsModal, AnimatedInfoModal } from "../ui/custom_modals/CustomModals";
import Notification from "./toast";
import Modal from "./modal";
import TestToast from "./TestToast";
type AnimationType = "scale" | "slide" | "fade" | "bounce";

const animationConfigs: Record<
  AnimationType,
  {
    title: string;
    description: string;
    bulletPoints: string[];
    accentColor: string;
  }
> = {
  scale: {
    title: "Scale Animation",
    description:
      "This modal uses the scale animation with spring physics. It scales from 75% to 100% with a gentle bounce effect and moves up slightly during the entrance.",
    bulletPoints: ["Scale: 0.75 → 1.0", "Y movement: 20px up", "Spring damping: 25", "Spring stiffness: 300"],
    accentColor: "blue",
  },
  slide: {
    title: "Slide Animation",
    description: "This modal slides down from above the viewport with a spring effect and subtle scaling for a smooth entrance.",
    bulletPoints: ["Y movement: -50px → 0px", "Scale: 0.95 → 1.0", "Spring damping: 20", "Spring stiffness: 300"],
    accentColor: "green",
  },
  fade: {
    title: "Fade Animation",
    description: "A lightweight fade animation that focuses on opacity changes for a subtle, elegant appearance without movement.",
    bulletPoints: ["Opacity: 0 → 1", "Duration: 0.3s", "Easing: easeOut", "No scaling or movement"],
    accentColor: "purple",
  },
  bounce: {
    title: "Bounce Animation",
    description: "A playful entrance combining scaling, rotation, and increased bounce for a more energetic feel.",
    bulletPoints: ["Scale: 0.3 → 1.0", "Rotation: -10° → 0°", "Spring damping: 15", "Spring stiffness: 400"],
    accentColor: "orange",
  },
};

export default function TestSeriUi() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<AnimationType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = () => {
    alert("Item deleted successfully!");
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
  };

  const handleReset = () => {
    alert("Settings reset to default!");
  };

  const [msg, setMsg] = useState<string | null>(null);
  const handleNodify = () => {
    console.log("1");
    setIsNotificationOpen(true);
    setMsg("Ban da thanh cong");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-[26px] font-[700]">1. Toast SeraUi</h3>
      <TestToast />
      <BaseNotification setIsModalOpen={setIsNotificationOpen} isModalOpen={isNotificationOpen} content={msg ?? ""} />
      <Button onClick={() => handleNodify()}>Test notify</Button>
      <Notification
        type="success"
        title="Success!"
        message="Operation completed successfully."
        showIcon={true}
        duration={3000}
        onClose={() => console.log("Closed")}
        position="top-center"
        className="bg-purple-500 border-purple-600"
      />
      <div className="space-y-3">
        <h3 className="text-[26px] font-[700]">2. Animation Modals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(animationConfigs) as AnimationType[]).map((key) => (
            <Button key={key} onClick={() => setActiveAnimation(key)} className="w-full" variant="outline">
              {animationConfigs[key].title}
            </Button>
          ))}
        </div>
      </div>

      {(Object.keys(animationConfigs) as AnimationType[]).map((key) => {
        const config = animationConfigs[key];
        return (
          <AnimatedInfoModal
            key={key}
            isOpen={activeAnimation === key}
            onClose={() => setActiveAnimation(null)}
            animation={key}
            title={config.title}
            description={config.description}
            bulletPoints={config.bulletPoints}
            accentColor={config.accentColor}
          />
        );
      })}
      <h3 className="text-[26px] font-[700]">3. Confirm</h3>
      <div className="flex flex-wrap gap-3">
        <ConfirmDelete onExcute={handleDelete} setIsModalOpen={setIsDeleteOpen} isModalOpen={isDeleteOpen} />

        <Button onClick={() => setIsLogoutOpen(true)} className="bg-orange-500 hover:bg-orange-600">
          Logout Prompt
        </Button>

        <Button onClick={() => setIsResetOpen(true)} className="bg-yellow-500 hover:bg-yellow-600">
          Reset Settings
        </Button>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
      </div>

      <ConfirmLogout isModalOpen={isLogoutOpen} setIsModalOpen={setIsLogoutOpen} onConfirm={handleLogout} />
      <ResetSettingsModal isModalOpen={isResetOpen} setIsModalOpen={setIsResetOpen} onConfirm={handleReset} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal" size="md" animation="fade">
        <p>Modal content goes here...</p>
      </Modal>
    </div>
  );
}
