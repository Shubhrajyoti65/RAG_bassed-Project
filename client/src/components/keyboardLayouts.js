import english from "simple-keyboard-layouts/build/layouts/english";
import hindi from "simple-keyboard-layouts/build/layouts/hindi";
import bengali from "simple-keyboard-layouts/build/layouts/bengali";
import telugu from "simple-keyboard-layouts/build/layouts/telugu";
import kannada from "simple-keyboard-layouts/build/layouts/kannada";
import malayalam from "simple-keyboard-layouts/build/layouts/malayalam";
import odia from "simple-keyboard-layouts/build/layouts/odia";
import punjabi from "simple-keyboard-layouts/build/layouts/punjabi";
import assamese from "simple-keyboard-layouts/build/layouts/assamese";
import urdu from "simple-keyboard-layouts/build/layouts/urdu";

// Custom layout for Tamil since it's missing in simple-keyboard-layouts
const tamilLayout = {
  layout: {
    default: [
      "\u0BE7 \u0BE8 \u0BE9 \u0BEA \u0BEB \u0BEC \u0BED \u0BEE \u0BEF \u0BF0 - = {bksp}",
      "{tab} \u0B86 \u0B88 \u0B8A \u0B8F \u0B90 \u0B93 \u0B94 \u0B83 [ ] \\",
      "{lock} \u0B85 \u0B87 \u0B89 \u0B8E \u0B92 \u0B95 \u0B99 \u0B9A \u0B9E {enter}",
      "{shift} \u0B9F \u0BA3 \u0BA4 \u0BA8 \u0BAA \u0BAE \u0BAF \u0BB0 \u0BB2 \u0BB5 \u0BB4 \u0BB3 \u0BB1 \u0BA9 {shift}",
      ".com @ {space}"
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{lock} A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M < > ? {shift}",
      ".com @ {space}"
    ]
  }
};

// Custom layout for Gujarati since it's missing in simple-keyboard-layouts
const gujaratiLayout = {
  layout: {
    default: [
      "\u0AE7 \u0AE8 \u0AE9 \u0AEA \u0AEB \u0AEC \u0AED \u0AEE \u0AEF \u0AF0 - = {bksp}",
      "{tab} \u0ABE \u0ABF \u0AC0 \u0AC1 \u0AC2 \u0AC3 \u0AC7 \u0AC8 \u0ACB \u0ACC [ ] \\",
      "{lock} \u0A85 \u0A86 \u0A87 \u0A88 \u0A89 \u0A8A \u0A8B \u0A8F \u0A90 \u0A93 \u0A94 {enter}",
      "{shift} \u0A95 \u0A96 \u0A97 \u0A98 \u0A9A \u0A9B \u0A9C \u0A9D \u0A9F \u0AA0 \u0AA1 \u0AA2 \u0AA3 \u0AA4 \u0AA5 \u0AA6 \u0AA7 \u0AA8 \u0AAA \u0AAB \u0AAC \u0AAD \u0AAE \u0AAF \u0AB0 \u0AB2 \u0AB5 \u0AB6 \u0AB7 \u0AB8 \u0AB9 \u0AB3 {shift}",
      ".com @ {space}"
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{lock} A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M < > ? {shift}",
      ".com @ {space}"
    ]
  }
};

const safeLayout = (imported) => {
  if (!imported) return english.layout || english.default?.layout;
  return imported.layout || imported.default?.layout || imported;
};

export const getKeyboardLayout = (language) => {
  switch (language) {
    case "Hindi": return safeLayout(hindi);
    case "Marathi": return safeLayout(hindi);
    case "Bengali": return safeLayout(bengali);
    case "Tamil": return safeLayout(tamilLayout);
    case "Telugu": return safeLayout(telugu);
    case "Gujarati": return safeLayout(gujaratiLayout);
    case "Kannada": return safeLayout(kannada);
    case "Malayalam": return safeLayout(malayalam);
    case "Odia": return safeLayout(odia);
    case "Punjabi": return safeLayout(punjabi);
    case "Assamese": return safeLayout(assamese);
    case "Urdu": return safeLayout(urdu);
    case "English":
    default:
      return safeLayout(english);
  }
};
