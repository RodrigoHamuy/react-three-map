export default {
  stories: ["stories/src/**/*.stories.{js,jsx,ts,tsx,mdx}"],
  storyOrder: () => ['canvas--maplibre', 'canvas--mapbox', 'comparison--*','*'],
  addons: {
    a11y: {
      enabled: false,
    },
    action: {
      enabled: false,
    },
    control: {
      enabled: false,
    },
    ladle: {
      enabled: false,
    },
    mode: {
      enabled: true,
    },
    rtl: {
      enabled: false,
      defaultState: false,
    },
    width: {
      enabled: false,
    },
  }
}