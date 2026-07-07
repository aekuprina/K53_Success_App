import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "za.co.k53success.app",
  appName: "K53 Success",
  webDir: "out",
  backgroundColor: "#f1f5f9",
  android: { allowMixedContent: false },
  ios: { contentInset: "automatic" },
};

export default config;
