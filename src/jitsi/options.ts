import { config } from "../environment";
import { getLangPref } from "../get-language-detector";
import { CustomToolbarButton, JitsiOptions } from "./types";
import { reportAction } from "../lib";

export const jitsiOptions = (
  roomName: string,
  el: Element | null,
  jwt: string,
  isMobile?: boolean,
): JitsiOptions => {
  const options = {
    roomName: config.vpaas + "/" + roomName,
    jwt: jwt,
    parentNode: el,
    lang: getLangPref(),

    configOverwrite: {
      analytics: {
        disabled: true,
        rtcstatsEnabled: false,
      },
      brandingRoomAlias: roomName,
      buttonsWithNotifyClick: <string[]>[],
      callStatsID: false,
      callStatsSecret: false,
      conferenceInfo: {
        autoHide: [
          "subject",
          "conference-timer",
          "participants-count",
          "e2ee",
          "transcribing",
          "video-quality",
          "insecure-room",
          // "highlight-moment"
          "top-panel-toggle",
        ],
      },
      customToolbarButtons: <CustomToolbarButton[]>[],
      disabledSounds: ["E2EE_OFF_SOUND", "E2EE_ON_SOUND"],
      disableGTM: true,
      doNotStoreRoom: true,
      disableBeforeUnloadHandlers: true,
      disableInviteFunctions: false,
      disableTileEnlargement: true,
      dropbox: {
        appKey: null,
      },
      e2eeLabels: {
        e2ee: "Video Bridge Encryption",
        labelToolTip:
          "Audio and Video Communication on this call is encrypted on the video bridge",
        description:
          "Video Bridge Encryption is currently EXPERIMENTAL. Please keep in mind that turning it on will effectively disable server-side provided services such as: phone participation. Also keep in mind that the meeting will only work for people joining from browsers with support for insertable streams.  Note that chats will not use this encryption.",
        label: "Enable Video Bridge Encryption",
        warning:
          "WARNING: Not all participants in this meeting seem to have support for Video Bridge Encryption. If you enable it they won't be able to see nor hear you.",
      },
      enableTalkWhileMuted: false,
      faceLandmarks: {
        enableFaceExpressionsDetection: false,
        enableDisplayFaceExpressions: false,
      },
      giphy: {
        enabled: false,
      },
      hideEmailInSettings: true,
      inviteAppName: "Brave Talk",
      localSubject: "Brave Talk",
      prejoinPageEnabled: true,
      recordings: {
        recordAudioAndVideo: false,
      },
      resolution: isMobile ? 360 : undefined,
      roomPasswordNumberOfDigits: false,
      startWithAudioMuted: true,
      startWithVideoMuted: true,
      localRecording: {
        disable: true,
      },
      toolbarConfig: {
        autoHideWhileChatIsOpen: true,
      },
      // taken from https://github.com/jitsi/jitsi-meet/blob/master/react/features/base/config/constants.ts#L16
      toolbarButtons: [
        "camera",
        "chat",
        "desktop",
        "download",
        "embedmeeting",
        "etherpad",
        "feedback",
        "filmstrip",
        "fullscreen",
        "hangup",
        "help",
        "highlight",
        "invite",
        "linktosalesforce",
        "livestreaming",
        "microphone",
        "mute-everyone",
        "mute-video-everyone",
        "participants-pane",
        "profile",
        "raisehand",
        // added to help de-clutter hand raising and gestures
        "reactions",
        "recording",
        "security",
        "select-background",
        "settings",
        "shareaudio",
        "noisesuppression",
        "sharedvideo",
        "shortcuts",
        "stats",
        "tileview",
        "toggle-camera",
        "videoquality",
        "whiteboard",
      ],
      transcribingEnabled: true,
      useHostPageLocalStorage: true,
      videoQuality: {
        persist: true,
      },
    },

    interfaceConfigOverwrite: {
      APP_NAME: "Brave Talk",
      DEFAULT_BACKGROUND: "#3B3E4F",
      DEFAULT_LOCAL_DISPLAY_NAME: "me",
      // a no-op
      DEFAULT_LOGO_URL: "https://talk.brave.com/images/brave_logo_dark.svg",
      DEFAULT_REMOTE_DISPLAY_NAME: "User",
      DISABLE_TRANSCRIPTION_SUBTITLES: false,

      //          DISABLE_FOCUS_INDICATOR: true,
      //          DISABLE_DOMINANT_SPEAKER_INDICATOR: true,

      // a no-op
      JITSI_WATERMARK_LINK: "https://brave.com",
      NATIVE_APP_NAME: "Brave Talk",
      PROVIDER_NAME: "Brave",
      //          SET_FILMSTRIP_ENABLED: false,
      // remove 'dial-in'
      SHARING_FEATURES: ["email", "url", "embed"],
      SHOW_CHROME_EXTENSION_BANNER: false,
      SUPPORT_URL: "https://community.brave.com/",
      TOOLBAR_BUTTONS: [
        "microphone",
        "camera",
        "desktop",
        "embedmeeting",
        "fullscreen",
        "fodeviceselection",
        "hangup",
        "profile",
        "chat",
        // must be enabled in JWT context.features object
        // "recording",
        // "livestreaming",
        "etherpad",
        "sharedvideo",
        "shareaudio",
        "settings",
        "raisehand",
        "videoquality",
        "filmstrip",
        "participants-pane",
        "feedback",
        "stats",
        "shortcuts",
        "tileview",
        "select-background",
        "help",
        "mute-everyone",
        "mute-video-everyone",
        "security",
        "toggle-camera",
        "invite",
      ],
    },

    onload: () => {
      document.title = options.interfaceConfigOverwrite.APP_NAME;
    },
  };

  const jwtContext = jwt_decode(jwt)?.context;
  const features = jwtContext?.features;
  const isModerator = jwtContext?.user?.moderator === "true";

  reportAction("features", { features });

  Object.entries(features).forEach(([feature, state]) => {
    if (state === "true") {
      options.interfaceConfigOverwrite.TOOLBAR_BUTTONS.push(feature);
      if (feature === "recording") {
        options.configOverwrite.conferenceInfo.autoHide.push(
          "highlight-moment",
        );
      }
      if (feature === "transcription" && isModerator) {
        options.configOverwrite.customToolbarButtons.push({
          icon: "data:image/png;base64,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",
          id: "leo",
          text: "Leo Button Title",
        });
        options.configOverwrite.buttonsWithNotifyClick.push("leo");
      }
    }
  });

  return options;
};
