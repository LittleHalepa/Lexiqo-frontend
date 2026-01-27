import { forwardRef, useImperativeHandle, useRef } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import animationData from "./Animations/Rocket.json";
import { useEffect } from "react";

export interface RocketAnimatedIconRef {
  playAnimation: () => void;
}

// interface RocketAnimatedIconProps {
//   size?: number;
// }

const RocketAnimatedIcon = forwardRef<RocketAnimatedIconRef, {}>(
  (_, ref) => {
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useImperativeHandle(ref, () => ({
      playAnimation: () => {
        if (lottieRef.current) {
          lottieRef.current.goToAndPlay(0, true);
        }
      },
    }));

    useEffect(() => {
      const timer = setTimeout(() => {
        lottieRef.current?.goToAndPlay(0, true);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    return (
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        autoplay={false}
        className="scale-200 md:scale-180 min-w-full"
      />
    );
  }
);

export default RocketAnimatedIcon;
