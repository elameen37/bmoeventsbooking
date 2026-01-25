import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const NavigationProgress = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress animation
    setIsNavigating(true);
    setProgress(0);

    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(30), 50);
    const timer2 = setTimeout(() => setProgress(60), 150);
    const timer3 = setTimeout(() => setProgress(80), 250);
    const timer4 = setTimeout(() => setProgress(100), 350);
    const timer5 = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [location.pathname]);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <Progress 
        value={progress} 
        className="h-1 rounded-none bg-transparent"
      />
    </div>
  );
};

export default NavigationProgress;
