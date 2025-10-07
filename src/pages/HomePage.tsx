import React, { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Highlighter } from "../components/ui/highlighter";

declare global {
  interface Window {
    VANTA: any;
  }
}

const HomePage: React.FC = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    (async () => {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
        );

        if (window.VANTA && vantaRef.current) {
          vantaEffectRef.current = window.VANTA.FOG({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
          });
        }
      } catch (err) {
        console.error("Error loading Vanta.js or Three.js scripts:", err);
      }
    })();

    return () => {
      // Cleanup the Vanta effect
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Text overlay */}

      {/* Carousel / Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10, // ensure it's below the overlay text
          color: "white",
          textAlign: "center",
          paddingTop: "40vh",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 text-black text-center pointer-events-none">
          <h1 className="text-4xl font-serif">notebook</h1>
          <p className="text-sm font-serif">learning for all kinds</p>
        </div>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Carousel className="rounded-xl overflow-hidden">
            <CarouselContent className="gap-2">
              <CarouselItem className="rounded-xl text-black bg-orange-100/50 md:basis-1/2 lg:basis-1/3">
                Ask questions
              </CarouselItem>
              <CarouselItem className="rounded-xl text-black bg-orange-100/50 md:basis-1/2 lg:basis-1/3">
                Listen to it
              </CarouselItem>
              <CarouselItem className="rounded-xl text-black bg-orange-100/50 md:basis-1/2 lg:basis-1/3">
                Test yourself
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
