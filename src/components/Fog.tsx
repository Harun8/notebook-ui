// import React, { useEffect, useRef } from "react";
// import { Highlighter } from "./ui/highlighter";

// declare global {
//   interface Window {
//     VANTA: any;
//   }
// }

// const FOG: React.FC = () => {
//   const vantaRef = useRef<HTMLDivElement>(null);
//   const vantaEffectRef = useRef<any>(null);

//   useEffect(() => {
//     const loadScript = (src: string): Promise<void> => {
//       return new Promise((resolve, reject) => {
//         const existingScript = document.querySelector(`script[src="${src}"]`);
//         if (existingScript) {
//           resolve();
//           return;
//         }

//         const script = document.createElement("script");
//         script.src = src;
//         script.async = true;
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error(`Failed to load ${src}`));
//         document.body.appendChild(script);
//       });
//     };

//     (async () => {
//       try {
//         await loadScript(
//           "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
//         );
//         await loadScript(
//           "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
//         );

//         if (window.VANTA && vantaRef.current) {
//           vantaEffectRef.current = window.VANTA.FOG({
//             el: vantaRef.current,
//             mouseControls: true,
//             touchControls: true,
//             gyroControls: false,
//             minHeight: 200.0,
//             minWidth: 200.0,
//           });
//         }
//       } catch (err) {
//         console.error("Error loading Vanta.js or Three.js scripts:", err);
//       }
//     })();

//     return () => {
//       // Cleanup the Vanta effect
//       if (vantaEffectRef.current) {
//         vantaEffectRef.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={vantaRef}
//       style={{
//         width: "100%",
//         height: "100vh",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Optional overlay content */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 1,
//           color: "white",
//           textAlign: "center",
//           paddingTop: "40vh",
//           fontSize: "2rem",
//         }}
//       >
//         <p>
//           The{" "}
//           <Highlighter action="underline" color="#FF9800">
//             Magic UI Highlighter
//           </Highlighter>{" "}
//           makes important{" "}
//           <Highlighter action="highlight" color="#87CEFA">
//             text stand out
//           </Highlighter>{" "}
//           effortlessly.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default FOG;
