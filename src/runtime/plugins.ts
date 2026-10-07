// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("osmoNav", "M0,0 C0.625,0.05 0,1 1,1");
