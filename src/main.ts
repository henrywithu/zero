import "./styles/fonts.css";
import "./styles/interface.css";
import "./runtime/plugins";
import { createExperience } from "./app/experience";
const experience = createExperience();

// Development inspection uses this instance rather than re-importing the entry.
if (import.meta.env.DEV) window.__zero = experience;
